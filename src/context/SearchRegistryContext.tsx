import { createContext, useContext, useState, ReactNode, useCallback } from "react"

export interface SearchOption {
    /** The unique identifier for this item. */
    id: string
    /** The searchable title. */
    title: string
    /** The searchable description. */
    description: string
    /** The target route name to navigate to. */
    page: string
    /** The ID of the parent item, if any. */
    parentId?: string
}

interface SearchContextType {
    /** The global registry of all searchable items. */
    searchIndex: Record<string, SearchOption>
    /** Function to register a new searchable item. */
    registerItem: (item: SearchOption) => void
    /** Whether the application is running in headless mode. */
    isHeadlessRender: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

/**
 * Provides the global registry of all searchable items and the function to register new items.
 * Also provides the `isHeadlessRender` flag, which indicates whether the application is running in headless mode.
 * @param children The children of the provider.
 * @param isHeadlessRender Whether the application is running in headless mode.
 * @param overrideIndex Optional override for the search index.
 * @param overrideRegister Optional override for the register function.
 */
export const SearchProvider = ({
    children,
    isHeadlessRender = false,
    overrideIndex,
    overrideRegister,
}: {
    children: ReactNode
    isHeadlessRender?: boolean
    overrideIndex?: Record<string, SearchOption>
    overrideRegister?: (item: SearchOption) => void
}) => {
    // We use a Record (object) instead of an Array to automatically deduplicate items by ID since Settings components might re-render or mount multiple times.
    const [searchIndex, setSearchIndex] = useState<Record<string, SearchOption>>({})

    const registerItem = useCallback((item: SearchOption) => {
        setSearchIndex((prev) => {
            if (prev[item.id]) {
                // If it already exists, update it if the parentId has changed like when the setting is toggled on/off and conditional state changes.
                if (prev[item.id].parentId !== item.parentId) {
                    return {
                        ...prev,
                        [item.id]: item,
                    }
                }
                return prev
            }
            return {
                ...prev,
                [item.id]: item,
            }
        })
    }, [])

    // If an override index or register function is provided, use them instead of the default.
    const activeIndex = overrideIndex || searchIndex
    const activeRegister = overrideRegister || registerItem

    return <SearchContext.Provider value={{ searchIndex: activeIndex, registerItem: activeRegister, isHeadlessRender }}>{children}</SearchContext.Provider>
}

export const useSearchRegistry = () => {
    const context = useContext(SearchContext)
    if (context === undefined) {
        throw new Error("useSearchRegistry must be used within a SearchProvider")
    }
    return context
}
