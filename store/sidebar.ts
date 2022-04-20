import { MutationTree, GetterTree } from "vuex";
export type SelectedComponent =
  | ""
  | "editor"
  | "profile"
  | "howto"
  | "explore"
  | "settings";
export type Side = "left" | "right";
export type DarkMode = "system" | "dark" | "light";

interface State {
  selectedComponent: SelectedComponent;
  visible: boolean;
  position: Side;
  resizeYStarted: boolean;
  resizeStartY: number;
  heightDiff: number;
  sidebarHeight: number;
  darkMode: DarkMode;
}

// todo: centrally define in config file
const DARK_MODE_DEFAULT = "light";

export const state: () => State = () => ({
  selectedComponent: "editor",
  visible: true,
  position: "left",
  resizeYStarted: false,
  resizeStartY: 0,
  heightDiff: 0,
  sidebarHeight: 300,
  darkMode: DARK_MODE_DEFAULT,
});

export const mutations: MutationTree<State> = {
  checkDarkMode(state: State) {
    if (!window) {
      return;
    }
    if (localStorage.theme === "dark") {
      state.darkMode = "dark";
    } else if (localStorage.theme === "light") {
      state.darkMode = "light";
    } else {
      state.darkMode = DARK_MODE_DEFAULT;
    }
  },
  toggleDarkMode(state: State) {
    if (state.darkMode === "system") {
      state.darkMode = "dark";
      localStorage.theme = "dark";
    } else if (state.darkMode === "dark") {
      localStorage.theme = "light";
      state.darkMode = "light";
    } else {
      localStorage.removeItem("theme");
      state.darkMode = "system";
    }
  },
  setSelectedComponent(state: State, component: SelectedComponent) {
    if (state.selectedComponent === component) {
      state.selectedComponent = "";
    } else {
      state.selectedComponent = component;
    }
  },
  setPosition(state: State, side: Side) {
    state.position = side;
  },
  togglePosition(state: State) {
    state.position = state.position === "left" ? "right" : "left";
  },
  toggle(state: State) {
    state.visible = !state.visible;
  },
  startResizeY(state: State, startY: number) {
    state.resizeYStarted = true;
    state.heightDiff = 0;
    state.resizeStartY = startY;
  },
  resizeY(state: State, height: number) {
    state.heightDiff = state.resizeStartY - height;
  },
  endResizeY(state: State) {
    if (state.heightDiff === 0) {
      state.visible = !state.visible;
    }
    state.resizeYStarted = false;
  },
  setHeight(state: State, sidebarHeight: number) {
    state.sidebarHeight = sidebarHeight;
  },
};

export const getters: GetterTree<State, State> = {
  darkMode(state, getters) {
    if (state.darkMode !== "system") {
      return state.darkMode;
    }
    if (typeof window === "undefined" || !window) {
      return "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  },
};
