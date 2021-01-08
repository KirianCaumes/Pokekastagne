import React, { useState } from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Status } from 'static/status'

/**
 * @typedef {object} ModalType
 * @property {boolean} isDisplay Is modal display
 * @property {string=} title Title
 * @property {React.ReactNode=} children Content
 * @property {function():any=} props.onClickYes On click
 * @property {function():any=} props.onClickNo On click
 */

/**
 * Modal
 * @param {ModalType} props
 */
function Modal({ isDisplay, title, children, onClickYes, onClickNo }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = useState(Status.RESOLVED)

    if (!isDisplay)
        return <></>

    return (
        <div className={classNames("modal is-active app-modal")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <form
                    onSubmit={async ev => {
                        ev.preventDefault()
                        setStatus(Status.PENDING)
                        await onClickYes?.()
                        setStatus(Status.RESOLVED)
                    }}
                >
                    <header className={classNames("modal-card-head")}>
                        <p className="modal-card-title">{title}</p>
                        <button
                            className="delete"
                            aria-label="close"
                            onClick={() => {
                                onClickNo?.()
                            }}
                        />
                    </header>
                    <section className={classNames("modal-card-body")}>
                        <div className="content">
                            {children}
                        </div>
                    </section>
                    <footer className={classNames("modal-card-foot flex-end")}>
                        <button
                            type="submit"
                            className={classNames("button is-pink", { 'is-loading': status === Status.PENDING })}
                        >
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span>Validate</span>
                        </button>
                        <button
                            type="button"
                            className="button"
                            onClick={() => {
                                onClickNo?.()
                            }}
                            disabled={status === Status.PENDING}
                        >
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                            <span>Cancel</span>
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    )
}
export default Modal