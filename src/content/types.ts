export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  media: string | null;
  link: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  icon: string;
  layout: "wide" | "tall";
};

export type Testimonial = {
  quote: string;
  name: string;
  company: string;
  avatar: string;
};
