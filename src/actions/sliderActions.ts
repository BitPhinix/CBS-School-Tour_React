import dispatcher from "../dispatcher";

export function toggle() {
    dispatcher.dispatch({
       type: "TOGGLE_NAVSLIDER"
    });
}

export function hide() {
    dispatcher.dispatch({
        type: "SET_NAVSLIDER",
        visible: false
    });
}

export function show() {
    dispatcher.dispatch({
        type: "SET_NAVSLIDER",
        visible: true
    });
}

export function showNavigation() {
    dispatcher.dispatch({
        type: "NAVSLIDER_SHOW_NAVIGATION"
    });
}
