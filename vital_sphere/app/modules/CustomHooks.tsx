import { useState, useEffect, RefObject } from "react";
import { WindowSize } from "./DataTypes";

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<WindowSize>({width: undefined, height: undefined});

    useEffect(() => {
        function handleResize() {
            setWindowSize({width: window.innerWidth, height: window.innerHeight});
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

export function useOutsideAlerter(ref: RefObject<HTMLElement | null>, callBackFunction: Function) {
  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callBackFunction();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}