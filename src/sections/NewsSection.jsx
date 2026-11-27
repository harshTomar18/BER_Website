import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { news } from '../config/siteConfig';
import { blogApi } from '../api';
import './NewsSection.css';

export function NewsCard({ post }) {
  const targetUrl = `/news-and-article/${post.slug}`;
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : post.date || '';

  return (
    <article className="nw__card">
      {post.featuredImage || post.image ? (
        <Link to={targetUrl} className="nw__img">
          <img src={post.featuredImage || post.image} alt={post.featuredImageAlt || post.title} loading="lazy" />
        </Link>
      ) : null}

      <div className="nw__body">
        <div className="nw__top-meta">
          <span className="nw__cat">{post.category}</span>
          {post.readingTime && (
            <span className="nw__time">
              <Clock size={12} />
              <span>{post.readingTime}m read</span>
            </span>
          )}
        </div>

        <h3>
          <Link to={targetUrl}>
            {post.title.length > 60 ? post.title.slice(0, 58) + '…' : post.title}
          </Link>
        </h3>

        <p>{post.excerpt}</p>

        <div className="nw__footer">
          {dateStr && (
            <span className="nw__date">
              <Calendar size={13} />
              <span>{dateStr}</span>
            </span>
          )}
          <Link to={targetUrl} className="nw__more">
            <span>Read More</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function NewsSection() {
  const [posts, setPosts] = useState(news.posts || []);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await blogApi.getPublicBlogs({ limit: 3 });
        if (res.success && res.data?.blogs && res.data.blogs.length > 0) {
          setPosts(res.data.blogs);
        }
      } catch (err) {
        // Soft fallback to siteConfig if offline
        console.error('Failed to load dynamic news section:', err);
      }
    };

    const timer = setTimeout(fetchLatest, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow={news.eyebrow} title={news.title} text={news.text} />
        <div className="nw__grid">
          {posts.map((p) => (
            <NewsCard key={p._id || p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
