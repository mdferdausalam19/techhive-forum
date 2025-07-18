const sampleComments = [
  {
    id: "c1",
    postId: "p1",
    author: {
      id: "u2",
      name: "Bob Lee",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    content: "Great tips! Memoization really helps.",
    date: "2025-07-10T13:00:00Z",
    parentId: null,
    replyTo: null,
  },
  {
    id: "c2",
    postId: "p1",
    author: {
      id: "u1",
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    content: "What about Suspense for data fetching?",
    date: "2025-07-10T14:00:00Z",
    parentId: null,
    replyTo: null,
  },
  {
    id: "c3",
    postId: "p1",
    author: {
      id: "u3",
      name: "Charlie Kim",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
    content: "Absolutely! Also, use React Profiler.",
    date: "2025-07-10T14:10:00Z",
    parentId: "c1",
    replyTo: "Bob Lee",
  },
];

export default sampleComments;
