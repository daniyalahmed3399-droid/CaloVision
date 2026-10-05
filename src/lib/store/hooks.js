import { useDispatch, useSelector, useStore } from "react-redux";

// Use these instead of the plain react-redux hooks, so there is one place
// to add typing or defaults later.
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useAppStore = useStore;
