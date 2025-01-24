"use client";

import React, { useState, useEffect } from "react";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

const MoviePage = ({ params }: MoviePageProps) => {
  const { id } = React.use(params);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=04553a35f2a43bffba8c0dedd36ac92b`
        );
        if (!movieResponse.ok) throw new Error("Failed to fetch movie details.");
        const movieData = await movieResponse.json();
        setMovie(movieData);

        const trailerResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=04553a35f2a43bffba8c0dedd36ac92b`
        );
        if (trailerResponse.ok) {
          const trailerData = await trailerResponse.json();
          const youtubeTrailer = trailerData.results.find(
            (video: any) => video.site === "YouTube" && video.type === "Trailer"
          );
          if (youtubeTrailer) setTrailerKey(youtubeTrailer.key);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <p className="text-lg font-semibold text-red-500">
          Error loading movie details.
        </p>
      </div>
    );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1 ? true : false;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-500">★</span>);
    }

    if (halfStar) {
      stars.push(<span key="half" className="text-yellow-500">☆</span>);
    }

    while (stars.length < 5) {
      stars.push(<span key={`empty-${stars.length}`} className="text-gray-400">★</span>);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">MovieDB</h1>
          <nav>
            <a href="/" className="text-lg hover:text-gray-300">Home</a>
          </nav>
        </div>
      </header>

      {/* Movie Details Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-6">
        <div className="flex flex-wrap md:flex-nowrap">
          {/* Poster */}
          <div className="w-full md:w-1/3">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{movie.title}</h1>
            <p className="text-sm text-gray-500 italic mb-4">{movie.tagline}</p>
            <p className="text-gray-700 mb-4">{movie.overview}</p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Genres:</span>{" "}
              {movie.genres.map((genre: any) => genre.name).join(", ")}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Release Date:</span> {movie.release_date}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Runtime:</span> {movie.runtime} minutes
            </p>
            <p className="text-gray-600 mb-4 flex items-center">
              <span className="font-semibold mr-2">Rating:</span> {renderStars(movie.vote_average)}
              <span className="ml-2 text-sm text-gray-500">({movie.vote_average}/10)</span>
            </p>
          </div>
        </div>

        {/* Trailer */}
        {trailerKey && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Watch Trailer</h2>
            <iframe
              className="w-full h-64 md:h-96 rounded-lg"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="YouTube Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 mt-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2025 MovieDB. All rights reserved.</p>
          <p className="text-sm">
            Built with ❤️ using Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MoviePage;
