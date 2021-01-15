import React, {useEffect, useState} from 'react'
import useLang from 'helpers/hooks/useLang'
import { AppProps } from 'app'// eslint-disable-line
// @ts-ignore
import {Section, Columns, Container} from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUser, faQuestionCircle, faSignOutAlt, faCogs } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Modal from "../components/general/modal";
/**
 * @param {AppProps} props
 */
export default function Index({ signOut, me }) {
    /** @type {[boolean, function(boolean):any]} Modal */
    const [isModalDisplayed, setIsModalDisplayed] = useState(!!true)
    const lang = useLang()

    return (
        <main
            className="app-page-index"
            style={{
                backgroundImage: `url(${require('assets/img/background.png').default})`
            }}
        >
           <Modal
               isDisplay={isModalDisplayed}
               title={'Install!'}
               onClickYes={() => setIsModalDisplayed(true)}
               onClickNo={() => setIsModalDisplayed(false)}
           >
           </Modal>
            <Section>
                <Container>
                    <img
                        src={require('assets/img/logo.png').default}
                        alt="Pokékastagne"
                        className="logo"
                    />
                    <br />
                    <br />
                    <div
                        className="main-content"
                    >
                        <Link
                            className="button is-large is-navyblue is-fullwidth"
                            to="/singleplayer"
                        >
                            <span>{lang('singleplayer')}</span>
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                        </Link>
                        <Link
                            className="button is-large is-blue is-fullwidth"
                            to="/multiplayer"
                        >
                            <span>{lang('multiplayer')}</span>
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faUsers} />
                            </span>
                        </Link>
                        <Link
                            className="button is-large is-navyblue is-fullwidth"
                            to="/how-to-play"
                        >
                            <span>{lang('howtoplay')}</span>
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faQuestionCircle} />
                            </span>
                        </Link>
                        <Columns>
                            <Columns.Column>
                                <Link
                                    className="button is-large is-yellow is-fullwidth"
                                    to="/"
                                    // @ts-ignore
                                    disabled
                                >
                                    <span className="icon is-small">
                                        <FontAwesomeIcon icon={faCogs} />
                                    </span>
                                    <span>{lang('settings')}</span>
                                </Link>
                            </Columns.Column>
                            <Columns.Column>
                                <button
                                    className="button is-large is-orange is-fullwidth"
                                    onClick={() => signOut()}
                                >
                                    <span>{lang('logout')}</span>
                                    <span className="icon is-small">
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                    </span>
                                </button>
                            </Columns.Column>
                        </Columns>
                    </div>
                </Container>
            </Section>
        </main>
    )
}
