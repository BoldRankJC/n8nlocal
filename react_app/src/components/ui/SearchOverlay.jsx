import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const SearchOverlay = ({ isOpen, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSearch = async (query) => {
    if (!query?.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          type: 'message',
          content: `Message containing "${query}"`,
          sender: 'John Doe',
          timestamp: '2 hours ago',
          conversation: 'Team Chat'
        },
        {
          id: 2,
          type: 'conversation',
          name: `${query} Discussion`,
          participants: 5,
          lastMessage: '10 minutes ago'
        },
        {
          id: 3,
          type: 'user',
          name: `${query} User`,
          status: 'online',
          email: `${query?.toLowerCase()}@example.com`
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const handleResultClick = (result) => {
    if (onSearch) {
      onSearch(result);
    }
    onClose();
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'message':
        return 'MessageCircle';
      case 'conversation':
        return 'Users';
      case 'user':
        return 'User';
      default:
        return 'Search';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 bg-background/80 backdrop-blur-sm animate-scale-in">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center space-x-3">
            <Icon name="Search" size={24} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Search Messages</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-accent/50"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-border bg-card">
          <div className="relative">
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search messages, conversations, or users..."
              value={searchQuery}
              onChange={handleInputChange}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            </div>
          ) : searchQuery && searchResults?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="SearchX" size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or check for typos.
              </p>
            </div>
          ) : searchResults?.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground mb-4">
                {searchResults?.length} result{searchResults?.length !== 1 ? 's' : ''} found
              </div>
              {searchResults?.map((result) => (
                <button
                  key={result?.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-3 bg-card hover:bg-accent/50 rounded-lg border border-border transition-colors duration-200 text-left"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name={getResultIcon(result?.type)} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {result?.type === 'message' && (
                        <>
                          <div className="text-sm font-medium text-foreground truncate">
                            {result?.sender} in {result?.conversation}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {result?.content}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {result?.timestamp}
                          </div>
                        </>
                      )}
                      {result?.type === 'conversation' && (
                        <>
                          <div className="text-sm font-medium text-foreground truncate">
                            {result?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result?.participants} participants • Last message {result?.lastMessage}
                          </div>
                        </>
                      )}
                      {result?.type === 'user' && (
                        <>
                          <div className="text-sm font-medium text-foreground truncate">
                            {result?.name}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {result?.email}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${
                              result?.status === 'online' ? 'bg-primary' : 'bg-muted-foreground'
                            }`}></div>
                            <span className="text-xs text-muted-foreground capitalize">
                              {result?.status}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Start searching</h3>
              <p className="text-muted-foreground">
                Enter keywords to search through messages, conversations, and users.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> to close</span>
            </div>
            <div>
              {searchResults?.length > 0 && (
                <span>{searchResults?.length} of {searchResults?.length} results</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;