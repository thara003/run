import React, { useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Heading,
  Text,
  Container,
  Input,
  Button,
  Link,
  Flex,
  Box,
  Modal,
  TwitterShareButton
} from 'ooni-components'

import Layout from '../components/Layout'
import { getUniversalLink } from '../utils/links'
import GraphicsOctopusModal from '../components/svgs/GraphicsOctopusModal.svg'
import OONIRunHero from '../components/OONIRunHero'

import URLs from '../components/URLs'

const StyleLinkButton = styled(Button)`
  text-transform: none;
`

const GraphicsWithGradient = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;

  svg {
    width: 100%;
  }

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(to bottom,
      rgba(142, 219, 248, 0),
      rgba(63, 128, 162, 1)
    );
  }
`

const TwitterButton = ({ universalLink }) => {
  const intl = useIntl()
  return (
    <TwitterShareButton
      url={universalLink}
      message={intl.formatMessage({ id: 'Share.Twitter.Tweet', defaultMessage: 'Run OONI Probe to test for censorship!' })}
    />
  )
}

const Home = () => {
  const [urls, setUrls] = useState([])
  const [showModal, setShowModal] = useState(false)

  const onSubmitURLs = useCallback(({ urls }) => {
    setUrls(urls.map((url) => {
      return {"url": new URL(url.url).toString()}
    }))
    setShowModal(true)
  }, [])

  const [universalLink, embedCode] = useMemo(() => {
    console.log('generating links and embed code')
    const universalLink = getUniversalLink(urls.map((e) => e.url))
    const embedCode = `
/* For a simple button */
<a href='${universalLink}' class='ooni-run-button'>Run OONI!</a>

/* For a tall banner */
<div data-link='${universalLink}' class='ooni-run-banner'>
  Fight Censorship
</div>

/* If you have not already included the OONI widget code */
<script src='https://cdn.jsdelivr.net/npm/ooni-run/dist/widgets.js'></script>
`
    return [universalLink, embedCode]
  }, [urls])

  return (
    <Layout>
      <OONIRunHero href={'https://ooni.torproject.org'} />

      <Container pt={4} maxWidth={800}>
        <Flex justifyContent='center'>
          <Box width={3 / 4}>
            <Heading h={2}><FormattedMessage id='Title.WhatCanYouDo' defaultMessage='What you can do' /></Heading>
            <FormattedMessage
              tagName={Text}
              id='WhatCanYouDoText.WebCensorship'
              defaultMessage='Generate a link and share it with your friends and contacts around the world. Encourage them to run OONI Probe to test the sites of your choice!'
            />
            <URLs onSubmit={onSubmitURLs} />
          </Box>
        </Flex>

        <Modal
          onHideClick={() => setShowModal(false)}
          show={showModal}
          closeButton='right'
          width={[9 / 10, 7 / 10]}
          p={0}
          style={{ borderRadius: '20px' }}
        >

          <Flex flexWrap='wrap' style={{ minHeight: '100%' }}>
            <Box width={[1, 1 / 3]} height={[1, 1 / 3]} style={{ backgroundColor: '#8ED8F8' }}>
              <GraphicsWithGradient>
                <GraphicsOctopusModal />
              </GraphicsWithGradient>
            </Box>
            <Box width={[1, 2 / 3]}>
              <Container p={[1, 2]} ml={[2, 4]} mr={[2, 4]}>
                <Heading h={1} textAlign='center'>
                  <FormattedMessage id='Modal.Heading.LinkReady' defaultMessage='Your link is ready!' />
                </Heading>

                <Heading pt={4} pb={2} h={3} textAlign='center'>
                  <FormattedMessage id='Modal.Heading.ShareIt' defaultMessage='Share it on social media' />
                </Heading>
                <Flex alignItems='center' justifyContent='center'>
                  <Box pr={2}>
                    <TwitterButton universalLink={universalLink} />
                  </Box>
                  <Box pr={2}>
                    <Link href={universalLink}>
                      <StyleLinkButton>
                        <FormattedMessage id='Modal.Button.Link' defaultMessage='Link' />
                      </StyleLinkButton>
                    </Link>
                  </Box>
                </Flex>

                <Heading pt={4} pb={2} h={3}>
                  <FormattedMessage id='Modal.Heading.ShareThisURL' defaultMessage='Share this URL with your friends' />
                </Heading>
                <Input value={universalLink} />

                <Heading pt={4} pb={2} h={3}>
                  <FormattedMessage id='Modal.Heading.EmbedThisCode' defaultMessage='Or embed this code on your website' />
                </Heading>
                <Input type='textarea' rows={6} value={embedCode} />

                <Box pt={4}>
                  <Flex justify='center' align='center'>
                    <Button onClick={() => setShowModal(false)}>
                      <FormattedMessage id='Modal.Button.Done' defaultMessage='Done' />
                    </Button>
                  </Flex>
                </Box>
              </Container>
            </Box>
          </Flex>
        </Modal>
      </Container>
    </Layout>
  )
}

export default Home