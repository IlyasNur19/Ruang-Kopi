import * as React from "react"
import { ToastAction } from "../components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER
    return count.toString()
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
}

const toastTimeouts = new Map()

function addToRemoveQueue(toastId, dispatch) {
    if (toastTimeouts.has(toastId)) return

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({ type: actionTypes.REMOVE_TOAST, toastId })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

function reducer(state, action) {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }
        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            }
        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action
            if (toastId) {
                addToRemoveQueue(toastId, state.dispatch)
            } else {
                state.toasts.forEach((t) => addToRemoveQueue(t.id, state.dispatch))
            }
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? { ...t, open: false }
                        : t
                ),
            }
        }
        case actionTypes.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return { ...state, toasts: [] }
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            }
        default:
            return state
    }
}

export const useToast = () => {
    const [state, setState] = React.useState({ toasts: [] })
    const dispatch = React.useCallback((action) => {
        setState((prevState) => reducer({ ...prevState, dispatch }, action))
    }, [])

    const toast = React.useCallback(({ title, description, variant, action: toastAction, ...props }) => {
        const id = genId()

        const update = (newProps) =>
            dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...newProps, id } })

        const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

        dispatch({
            type: actionTypes.ADD_TOAST,
            toast: {
                ...props,
                title,
                description,
                variant,
                open: true,
                id,
                onOpenChange: (open) => {
                    if (!open) dismiss()
                },
                action: toastAction ? (
                    <ToastAction altText={toastAction.altText || "Action"} onClick={toastAction.onClick}>
                        {toastAction.label}
                    </ToastAction>
                ) : undefined,
            },
        })

        return { id, dismiss, update }
    }, [dispatch])

    const dismiss = React.useCallback((toastId) => {
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
    }, [dispatch])

    return { toast, dismiss, toasts: state.toasts }
}
