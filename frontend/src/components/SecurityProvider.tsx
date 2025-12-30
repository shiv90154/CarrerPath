import { useEffect } from 'react';

const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Disable right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable common inspection shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12 (Developer Tools)
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+I (Developer Tools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+S (Save Page)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+C (Element Inspector)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+K (Web Console in Firefox)
            if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+E (Network tab in Firefox)
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+P (Print)
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                return false;
            }

            return true;
        };

        // Disable drag and drop
        const handleDragStart = (e: DragEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable text selection on double click
        const handleSelectStart = (e: Event) => {
            e.preventDefault();
            return false;
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('selectstart', handleSelectStart);

        // Disable text selection globally
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        // Use setProperty for browser-specific properties
        document.body.style.setProperty('-moz-user-select', 'none');
        document.body.style.setProperty('-ms-user-select', 'none');

        // Disable image dragging
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.draggable = false;
        });

        // Console warning message
        console.clear();
        console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
        console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or "hack" someone\'s account, it is a scam and will give them access to your account.', 'color: red; font-size: 16px;');

        // Cleanup function
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('dragstart', handleDragStart);
            document.removeEventListener('selectstart', handleSelectStart);
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            // Reset browser-specific properties
            document.body.style.removeProperty('-moz-user-select');
            document.body.style.removeProperty('-ms-user-select');
        };
    }, []);

    return <>{children}</>;
};

export default SecurityProvider;