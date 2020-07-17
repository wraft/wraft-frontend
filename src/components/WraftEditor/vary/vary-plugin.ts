import { Plugin } from 'prosemirror-state';
// import { ResolvedPos, bool, Cast } from '@remirror/core';

// type Animal

// const hasCursor = <T extends object>(arg: T): arg is T & { $cursor: ResolvedPos } => {
//     return bool(Cast(arg).$cursor);
// };

class SelectionSizeTooltip {
    tooltip: any;
    constructor(view:any) {
        const m = view.dom
        // console.log('view', view, m)

        this.tooltip = document.createElement("div")
        this.tooltip.className = "tooltip"
        m.appendChild(this.tooltip)
        

        this.update(view, null)
    }
    
    update(view:any, lastState:any) {
        console.log('view', view, lastState)
    }

    destroy() {

    }
}

export const createVaryExtensionPlugin = () => {
    return new Plugin({
        props: {
            handleDOMEvents: {
                onClick(e) {
                    console.log('view', e)
                    return true;
                },
            },
        },
        view(editorView) { return new SelectionSizeTooltip(editorView) }
    });
};
