import { createPortal } from 'react-dom';
import { DropHereState } from '@/hooks/use-drop-here';

type DropHereProps = {
    state: DropHereState;
};

export const DropHere = ({ state }: DropHereProps) => {
    const { isVisible, targetElementId, rect } = state;

    if (!isVisible || !rect || !targetElementId) {
        return null;
    }

    const dropHereStyles: React.CSSProperties = {
        position: 'fixed',
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        border: '2px solid rgb(34, 197, 94)',
        borderRadius: '8px',
        zIndex: 99998,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return createPortal(
        <div style={dropHereStyles}>
            <div
                style={{
                    backgroundColor: 'rgb(34, 197, 94)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
            >
                Drop Here
            </div>
        </div>,
        document.body
    );
};