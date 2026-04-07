export default function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "facebook":
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm2 5H8.8C8.4 5 8 5.3 8 5.8V7h2l-.3 2H8v5H6V9H5V7h1V5.5C6 4 6.9 3 8.5 3 9.1 3 10 3.1 10 3.1V5z" />
        </svg>
      );
    case "instagram":
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C5.8 0 5.5 0 4.7.1 1.9.2.2 1.9.1 4.7 0 5.5 0 5.8 0 8s0 2.5.1 3.3c.1 2.8 1.8 4.5 4.6 4.6.8.1 1.1.1 3.3.1s2.5 0 3.3-.1c2.8-.1 4.5-1.8 4.6-4.6.1-.8.1-1.1.1-3.3s0-2.5-.1-3.3C15.8 1.9 14.1.2 11.3.1 10.5 0 10.2 0 8 0zm0 1.4c2.2 0 2.4 0 3.3.1 2.1.1 3.1 1.1 3.2 3.2.1.9.1 1.1.1 3.3s0 2.4-.1 3.3c-.1 2.1-1.1 3.1-3.2 3.2-.9.1-1.1.1-3.3.1s-2.4 0-3.3-.1C2.6 14.3 1.6 13.3 1.5 11.3c-.1-.9-.1-1.1-.1-3.3s0-2.4.1-3.3C1.6 2.5 2.6 1.5 4.7 1.4c.9-.1 1.1-.1 3.3-.1zM8 3.9A4.1 4.1 0 1 0 8 12.1 4.1 4.1 0 0 0 8 3.9zm0 6.7A2.7 2.7 0 1 1 8 5.3a2.7 2.7 0 0 1 0 5.3zm4.3-6.9a.95.95 0 1 0 0 1.9.95.95 0 0 0 0-1.9z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9 1v9.1A2.1 2.1 0 1 1 6.9 8H5a4 4 0 1 0 4 4V5.3A6.3 6.3 0 0 0 12.7 7V5.1A4.3 4.3 0 0 1 9 1z" />
        </svg>
      );
    case "youtube":
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M15.4 4.3S15.2 3 14.5 2.3c-.7-.7-1.5-.8-1.9-.8C10.6 1.4 8 1.4 8 1.4s-2.6 0-4.6.1c-.4.1-1.2.1-1.9.8C.8 3 .6 4.3.6 4.3S.4 5.8.4 7.3v1.4c0 1.5.2 3 .2 3s.2 1.3.9 2c.7.7 1.6.7 2.1.7C5 14.6 8 14.6 8 14.6s2.6 0 4.6-.2c.4-.1 1.2-.1 1.9-.8.7-.7.9-2 .9-2s.2-1.5.2-3V7.3c0-1.5-.2-3-.2-3zM6.5 10.1V5.6l4.3 2.3-4.3 2.2z" />
        </svg>
      );
    case "twitter":
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12.6 1h2.4L9.9 6.8 16 15h-4.4l-3.7-4.8L3.6 15H1.2l5.5-6.2L0 1h4.5l3.3 4.4L12.6 1zm-.8 12.6h1.3L4.3 2.4H2.9l8.9 11.2z" />
        </svg>
      );
    case "google":
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 7.2v1.9h3.2c-.3 1.6-1.7 2.8-3.2 2.8-2 0-3.6-1.6-3.6-3.6S6 4.7 8 4.7c.9 0 1.7.3 2.3.9l1.4-1.4C10.6 3.1 9.4 2.5 8 2.5 4.9 2.5 2.5 4.9 2.5 8S4.9 13.5 8 13.5c3 0 5.3-2.1 5.3-5.3 0-.3 0-.7-.1-1H8z" />
        </svg>
      );
    case "tripadvisor":
      return (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm-.5 9.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm4 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM4 7.5A3.5 3.5 0 0 1 7.5 4h4A3.5 3.5 0 0 1 15 7.5h-1a2.5 2.5 0 0 0-2.5-2.5h-4A2.5 2.5 0 0 0 5 7.5H4z" />
        </svg>
      );
    default:
      return null;
  }
}
