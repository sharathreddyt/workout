// Lazy loading for YouTube iframes to prevent mobile crashes
class LazyVideoLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Hide loading message once initialization starts
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
            setTimeout(() => {
                loadingMessage.style.display = 'none';
            }, 500);
        }

        // Replace all iframes with placeholder divs
        this.replaceIframesWithPlaceholders();
        
        // Set up intersection observer for lazy loading
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: '100px', // Load when 100px before entering viewport
                    threshold: 0.1
                }
            );
            
            // Observe all video placeholders
            document.querySelectorAll('.video-placeholder').forEach(placeholder => {
                this.observer.observe(placeholder);
            });
        } else {
            // Fallback for older browsers - load on click
            this.setupClickToLoad();
        }
    }

    replaceIframesWithPlaceholders() {
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
            const placeholder = this.createPlaceholder(iframe);
            iframe.parentNode.replaceChild(placeholder, iframe);
        });
    }

    createPlaceholder(iframe) {
        const placeholder = document.createElement('div');
        placeholder.className = 'video-placeholder';
        placeholder.dataset.src = iframe.src;
        placeholder.dataset.title = iframe.title;
        placeholder.dataset.width = iframe.width;
        placeholder.dataset.height = iframe.height;
        
        // Extract video ID from YouTube URL
        const videoId = this.extractVideoId(iframe.src);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        
        placeholder.innerHTML = `
            <div class="video-thumbnail" style="
                background-image: url('${thumbnailUrl}');
                background-size: cover;
                background-position: center;
                width: 100%;
                height: 315px;
                border-radius: 8px;
                position: relative;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            ">
                <div class="play-button" style="
                    width: 80px;
                    height: 80px;
                    background: rgba(255, 0, 0, 0.9);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 32px;
                    transition: transform 0.3s ease;
                    border: none;
                    cursor: pointer;
                ">
                    ▶
                </div>
                <div class="video-title" style="
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 8px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 500;
                ">
                    ${iframe.title}
                </div>
            </div>
        `;

        placeholder.addEventListener('click', () => {
            this.loadVideo(placeholder);
        });

        return placeholder;
    }

    extractVideoId(url) {
        const regex = /(?:youtube\.com\/embed\/|youtu\.be\/)([^?&\n]+)/;
        const match = url.match(regex);
        return match ? match[1] : 'dQw4w9WgXcQ'; // Fallback video ID
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                // Add a small delay to prevent too many videos loading at once
                setTimeout(() => {
                    this.loadVideo(placeholder);
                }, 100);
                this.observer.unobserve(placeholder);
            }
        });
    }

    loadVideo(placeholder) {
        const iframe = document.createElement('iframe');
        iframe.src = placeholder.dataset.src;
        iframe.title = placeholder.dataset.title;
        iframe.width = placeholder.dataset.width;
        iframe.height = placeholder.dataset.height;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.maxWidth = '560px';
        iframe.style.height = '315px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.style.marginTop = '1rem';
        iframe.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';

        placeholder.parentNode.replaceChild(iframe, placeholder);
    }

    setupClickToLoad() {
        document.querySelectorAll('.video-placeholder').forEach(placeholder => {
            placeholder.addEventListener('click', () => {
                this.loadVideo(placeholder);
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LazyVideoLoader();
});

// Add hover effects for play buttons
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .video-placeholder:hover .play-button {
            transform: scale(1.1);
            background: rgba(255, 0, 0, 1);
        }
        
        @media (max-width: 768px) {
            .video-thumbnail {
                height: 220px !important;
            }
            .play-button {
                width: 60px !important;
                height: 60px !important;
                font-size: 24px !important;
            }
        }
        
        @media (max-width: 480px) {
            .video-thumbnail {
                height: 200px !important;
            }
            .play-button {
                width: 50px !important;
                height: 50px !important;
                font-size: 20px !important;
            }
            .video-title {
                font-size: 12px !important;
                padding: 6px !important;
            }
        }
    `;
    document.head.appendChild(style);
});
