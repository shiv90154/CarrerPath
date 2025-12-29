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

            // Disable Ctrl+A (Select All) - optional, might affect user experience
            // if (e.ctrlKey && e.key === 'a') {
            //   e.preventDefault();
            //   return false;
            // }

            return true;
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        // Disable text selection (optional - might affect UX)
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';

        // Cleanup function
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
        };
    }, []);

    return <>{children}</>;
};

export default SecurityProvider;