import { useEffect, useRef } from 'react';

export function useHorizontalScroll(enabled: boolean) {
    const railRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const rail = railRef.current;

        if (!enabled || rail === null) {
            return;
        }

        const originalSnapType = rail.style.scrollSnapType;
        const originalCursor = rail.style.cursor;
        const originalUserSelect = rail.style.userSelect;
        let suppressClick = false;
        let drag: {
            pointerId: number;
            startX: number;
            scrollLeft: number;
            active: boolean;
        } | null = null;

        const restoreSnap = () => {
            rail.style.scrollSnapType = originalSnapType;
        };

        const finishDrag = () => {
            if (drag !== null && rail.hasPointerCapture(drag.pointerId)) {
                rail.releasePointerCapture(drag.pointerId);
            }

            drag = null;
            rail.style.cursor = originalCursor;
            rail.style.userSelect = originalUserSelect;
        };

        const handlePointerDown = (event: PointerEvent) => {
            suppressClick = false;

            if (event.pointerType !== 'mouse') {
                restoreSnap();
                return;
            }

            if (
                event.button !== 0 ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                rail.scrollWidth <= rail.clientWidth ||
                (event.target instanceof Element &&
                    event.target.closest('button, input, select, textarea'))
            ) {
                return;
            }

            drag = {
                pointerId: event.pointerId,
                startX: event.clientX,
                scrollLeft: rail.scrollLeft,
                active: false,
            };
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (drag === null || event.pointerId !== drag.pointerId) {
                return;
            }

            const distance = event.clientX - drag.startX;

            if (!drag.active && Math.abs(distance) < 6) {
                return;
            }

            if (!drag.active) {
                drag.active = true;
                suppressClick = true;
                rail.style.scrollSnapType = 'none';
                rail.style.cursor = 'grabbing';
                rail.style.userSelect = 'none';
                rail.setPointerCapture(event.pointerId);
            }

            event.preventDefault();
            rail.scrollLeft = drag.scrollLeft - distance;
        };

        const handleClick = (event: MouseEvent) => {
            if (suppressClick) {
                event.preventDefault();
                event.stopPropagation();
                suppressClick = false;
            }
        };

        const preventNativeDrag = (event: DragEvent) => event.preventDefault();

        rail.addEventListener('pointerdown', handlePointerDown);
        rail.addEventListener('dragstart', preventNativeDrag);
        rail.addEventListener('click', handleClick, true);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', finishDrag);
        window.addEventListener('pointercancel', finishDrag);
        window.addEventListener('blur', finishDrag);

        return () => {
            rail.removeEventListener('pointerdown', handlePointerDown);
            rail.removeEventListener('dragstart', preventNativeDrag);
            rail.removeEventListener('click', handleClick, true);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', finishDrag);
            window.removeEventListener('pointercancel', finishDrag);
            window.removeEventListener('blur', finishDrag);
            finishDrag();
            restoreSnap();
        };
    }, [enabled]);

    return railRef;
}
