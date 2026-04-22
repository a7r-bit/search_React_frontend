import type { AppDispatch } from "@/app/store";
import type { RootState } from "@/app/root-reducer";
import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
