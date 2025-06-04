import React, { useState } from 'react';
import { BookMarked, ChevronDown, ChevronUp } from 'lucide-react';

const BookmarkletHelper: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const bookmarkletCode = `javascript:(function(){
    const selection=window.getSelection().toString();
    if(selection){
      window.open('${window.location.origin}?text='+encodeURIComponent(selection));
    }
  })();`;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-purple-600" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Quick Selection Tool
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Add this bookmarklet to quickly generate metaphors from selected text on any webpage:
          </p>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              On Mobile (iOS Safari):
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Copy this link: <button
                onClick={() => {
                  navigator.clipboard.writeText(bookmarkletCode);
                }}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline"
              >
                Metaphorever Selection
              </button></li>
              <li>Tap the Share button (rectangle with arrow)</li>
              <li>Scroll down and tap "Add Bookmark"</li>
              <li>Save the bookmark</li>
              <li>Go to Bookmarks and tap "Edit"</li>
              <li>Find the bookmark you just created</li>
              <li>Replace the URL with the copied code</li>
            </ol>

            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              On Desktop:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Right-click this link and add to bookmarks: <a
                href={bookmarkletCode}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline"
                onClick={(e) => e.preventDefault()}
              >
                Metaphorever Selection
              </a></li>
              <li>To use: Select any text on a webpage and click the bookmark</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkletHelper;