import { Creator, Video } from "./types";

const creators: Record<string, Creator> = {
  maya: { id: "maya", name: "Maya Chen", handle: "@mayamakes", subscribers: 18400, description: "Finding the small, beautiful details in everyday life." },
  devon: { id: "devon", name: "Devon Park", handle: "@devonpark", subscribers: 92300, description: "Field notes, slow travel, and good questions." },
  sam: { id: "sam", name: "Sam Okafor", handle: "@samokafor", subscribers: 32100, description: "Making the complicated feel a little more human." },
  rio: { id: "rio", name: "Rio Alvarez", handle: "@rioroams", subscribers: 6700, description: "A camera, a curious mind, and no rush." },
};

const images = [
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85",
];

export const mockVideos: Video[] = [
  ["sunrise", "A quiet morning above the clouds", "maya", "Nature", "1.2M", "2 days ago", "08:42"],
  ["coast", "The long way home: driving the coast", "devon", "Travel", "482K", "4 days ago", "14:18"],
  ["analog", "Why I still make things by hand", "maya", "People", "92K", "1 week ago", "06:29"],
  ["night", "Night walks through a sleeping city", "rio", "Vlogs", "218K", "1 week ago", "11:07"],
  ["tide", "Learning to read the tide", "devon", "Education", "74K", "2 weeks ago", "18:53"],
  ["studio", "Building a tiny studio that works", "sam", "Technology", "335K", "3 weeks ago", "12:36"],
  ["forest", "A field guide to the quiet forest", "rio", "Nature", "51K", "1 month ago", "09:21"],
  ["signal", "The human side of the internet", "sam", "Education", "129K", "1 month ago", "21:04"],
].map(([id, title, creatorId, category, views, uploadedAt, duration], i) => ({
  id, title, description: "A real-world story, recorded and shared by a real person. This is part of Yoohoo's growing library of human-made video.", creator: creators[creatorId], thumbnailUrl: images[i], videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", duration, views: Number(views.replace("K", "000").replace("M", "000000")), uploadedAt, category: category as Video["category"], verificationStatus: "approved" as const,
}));

export const mockCreators = creators;
