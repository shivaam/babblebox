import { useEffect, useState } from "react";
import Section from "./section";
import React from "react";
import { axiosInstance } from "../utils";

const movies = [
    {"title": "/add-chat.webp", "chat_topic": "Create new chat"},
    {"title": "/breaking-bad.webp", "chat_topic": "Exploring the universe's mysteries"},
    {"title": "/the-leftovers.jpg", "chat_topic": "Advancements in renewable energy"},
    {"title": "/game-of-thrones.jpg", "chat_topic": "The evolution of artificial intelligence"},
    {"title": "/true-detective.jpg", "chat_topic": "Secrets of effective communication"},
    {"title": "/walking-dead.jpg", "chat_topic": "Cooking secrets from around the world"},
    {"title": "/breaking-bad.webp", "chat_topic": "Understanding the stock market"},
    {"title": "/the-leftovers.jpg", "chat_topic": "Mysteries of ancient civilizations"},
    {"title": "/game-of-thrones.jpg", "chat_topic": "The history of video games"},
    {"title": "/true-detective.jpg", "chat_topic": "The art of making perfect coffee"},
    {"title": "/walking-dead.jpg", "chat_topic": "Travel tips for budget explorers"}
];


export interface Chat {
    id: string;
    topic: string;
    image: string;
    owner_username: string;
}

export const ChatSections: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchChats = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get<Chat[]>('Chat/');
          const chats = response.data.map(chat => ({
            ...chat,
            image: movies[Math.floor(Math.random() * movies.length)].title // Assigning random images
          }));
          setChats(chats);
          setError(null);
        } catch (error) {
          setError('Failed to fetch chats.');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchChats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <Section title="Recent Chats" movies={chats} sx={{ mt: 3 }} />
        <Section title="Trending Chats" movies={chats} sx={{ mt: 3 }} />
        <Section title="Top Chats" movies={chats} sx={{ mt: 3 }} />
      </div>
    );
  };
