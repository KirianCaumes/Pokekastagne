import React from 'react'
import { AppProps } from 'app'// eslint-disable-line
// @ts-ignore
import { Section, Container, Content } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import useLang from 'helpers/hooks/useLang'

/**
 * @param {AppProps} props
 */
export default function Howtoplay({ test }) {
    const lang = useLang()

    return (
        <main
            className="app-page-howtoplay"
            style={{
                backgroundImage: `url(${require('assets/img/background.png').default})`
            }}
        >
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
                        <Content>
                            <h1>How to play?</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus. Ut vulputate semper dui. Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque.</p>
                            <h2>Lorem</h2>
                            <p>Curabitur accumsan turpis pharetra <strong>augue tincidunt</strong> blandit. Quisque condimentum maximus mi, sit amet commodo arcu rutrum id. Proin pretium urna vel cursus venenatis. Suspendisse potenti. Etiam mattis sem rhoncus lacus dapibus facilisis. Donec at dignissim dui. Ut et neque nisl.</p>
                            <ul>
                                <li>In fermentum leo eu lectus mollis, quis dictum mi aliquet.</li>
                                <li>Morbi eu nulla lobortis, lobortis est in, fringilla felis.</li>
                                <li>Aliquam nec felis in sapien venenatis viverra fermentum nec lectus.</li>
                                <li>Ut non enim metus.</li>
                            </ul>
                        </Content>
                        <Link
                            className="button is-large is-navyblue is-fullwidth"
                            to="/"
                        >
                            <span className="icon is-small">
                                <FontAwesomeIcon icon={faHome} />
                            </span>
                            <span>{lang('homepage')}</span>
                        </Link>
                    </div>
                </Container>
            </Section>
        </main>
    )
}