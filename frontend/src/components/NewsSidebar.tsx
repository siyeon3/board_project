import React, { useEffect, useState } from 'react';
import newsService, { NewsArticle } from '../services/newsService';

/**
 * 뉴스 사이드바 컴포넌트
 * 최신 뉴스를 표시하는 사이드바
 */
interface NewsSidebarProps {
  position: 'left' | 'right';
  category?: string;
  title?: string;
}

const NewsSidebar: React.FC<NewsSidebarProps> = ({ position, category, title }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await newsService.getTopHeadlines('kr', category, 2);
        setArticles(data.articles);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError('뉴스를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  };

  if (loading) {
    return (
      <div className="hidden lg:block w-80 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return null;
  }

  return (
    <div className="hidden lg:block w-80 space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
          <h2 className="text-white font-bold text-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            {title || '최신 뉴스'}
          </h2>
        </div>

        {/* News Articles */}
        <div className="divide-y divide-gray-100">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Article Image */}
              {article.urlToImage && (
                <div className="mb-3 overflow-hidden rounded-lg">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Article Content */}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{article.source}</span>
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-500">
            Powered by NewsAPI
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsSidebar;
