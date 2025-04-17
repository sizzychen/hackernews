import { $fetch } from 'ofetch'
import type { Item, SearchResponse } from '~~/types'
import { BASE_URL } from '../../utils/constants'
import { validFeeds } from '~~/utils/api'
import { fetchItem } from './item.get'

const TIMEOUT = 10000 // 10 seconds timeout

/**
 * Search items from Hacker News API
 */
async function searchItems(query: string, page: number = 1, limit: number = 20): Promise<SearchResponse> {
  // Fetch stories from different feeds to search through
  const feeds = ['topstories', 'newstories', 'showstories', 'askstories']
  let allItems: Item[] = []
  
  // Improved regex to handle special characters better
  // Escape special regex characters and use word boundaries for better matching
  const escapedQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const searchRegex = new RegExp(escapedQuery, 'i')
  
  try {
    // Get IDs from feeds
    const feedPromises = feeds.map(async (feed) => {
      try {
        const ids = await $fetch(`${BASE_URL}/${feed}.json`, { 
          timeout: TIMEOUT 
        }) as number[]
        
        return Array.isArray(ids) ? ids.slice(0, 100) : [] // Limit to first 100 items per feed for performance
      } catch (error) {
        console.error(`Error fetching ${feed}:`, error)
        return []
      }
    })
    
    const feedIds = await Promise.all(feedPromises)
    const allIds = Array.from(new Set([].concat(...feedIds))) // Remove duplicates
    
    if (allIds.length === 0) {
      return { items: [], total: 0, page: 1, pages: 1 }
    }
    
    // Fetch items in batches to avoid overwhelming the API
    const batchSize = 20
    const batches = []
    
    for (let i = 0; i < Math.min(allIds.length, 500); i += batchSize) {
      const batchIds = allIds.slice(i, i + batchSize)
      batches.push(Promise.allSettled(
        batchIds.map(id => fetchItemWithTimeout(String(id), TIMEOUT))
      ))
    }
    
    const results = await Promise.all(batches)
    
    // Process results, filtering out any that failed or returned null
    for (const batch of results) {
      for (const result of batch) {
        if (result.status === 'fulfilled' && result.value) {
          allItems.push(result.value)
        }
      }
    }
    
    // Filter out any invalid items
    allItems = allItems.filter(item => item && item.id)
    
    // Filter items based on search query with proper null checks
    const filteredItems = allItems.filter(item => 
      (item.title && searchRegex.test(item.title)) || 
      (item.content && searchRegex.test(item.content)) || 
      (item.user && searchRegex.test(item.user))
    )
    
    // Sort by points (relevance)
    filteredItems.sort((a, b) => (b.points || 0) - (a.points || 0))
    
    // Calculate pagination with edge case handling
    const totalItems = filteredItems.length
    const totalPages = Math.max(1, Math.ceil(totalItems / limit))
    const safePage = Math.min(Math.max(1, page), totalPages)
    
    const startIndex = (safePage - 1) * limit
    const endIndex = Math.min(startIndex + limit, totalItems)
    const paginatedItems = filteredItems.slice(startIndex, endIndex)
    
    return {
      items: paginatedItems,
      total: totalItems,
      page: safePage,
      pages: totalPages
    }
  } catch (error) {
    console.error('Search error in searchItems:', error)
    throw error
  }
}

/**
 * Extended fetchItem function to include timeout
 */
async function fetchItemWithTimeout(id: string, timeout: number): Promise<Item | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const item = await $fetch(`/item/${id}.json`, {
      baseURL: BASE_URL,
      signal: controller.signal,
      timeout: false // Disable default timeout since we're handling it
    }) as Item;
    
    clearTimeout(timeoutId);
    return item;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default defineCachedEventHandler(async (event) => {
  const { q, page = '1', limit = '20' } = getQuery(event) as { q?: string, page: string, limit: string }
  
  // Validate query parameter
  if (!q || q.trim().length === 0) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Search query is required',
    })
  }
  
  // Validate page parameter
  const pageNum = parseInt(page, 10)
  const limitNum = parseInt(limit, 10)
  
  if (isNaN(pageNum) || pageNum < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page number must be a positive integer',
    })
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Limit must be between 1 and 100',
    })
  }
  
  try {
    const response = await searchItems(q, pageNum, limitNum)
    return response
  } catch (error) {
    console.error('Search error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to perform search',
      cause: error
    })
  }
}, {
  name: 'api/hn',
  getKey(event) {
    const { q, page = '1', limit = '20' } = getQuery(event)
    return ['search', q, page, limit].join('/')
  },
  swr: false,
  maxAge: 300, // Cache for 5 minutes
})
