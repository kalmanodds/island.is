import React from 'react'
import {
  Text,
  GridContainer,
  Hidden,
  Box,
  Link,
  Button,
} from '@island.is/island-ui/core'
import { GridItems, IconTitleCard } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { LifeEventPage } from '@island.is/web/graphql/schema'
import CardWithFeaturedItems from '../CardWithFeaturedItems/CardWithFeaturedItems'

interface LifeEventsSectionProps {
  heading: string
  headingId: string
  seeMoreText: string
  items: LifeEventPage[]
}

export const LifeEventsSection = ({
  heading,
  headingId,
  items = [],
  seeMoreText,
}: LifeEventsSectionProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <>
      <GridContainer>
        <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
          <Text variant="h2" as="h2" id={headingId}>
            {heading}
          </Text>
          <Box display={['none', 'none', 'none', 'block']}>
            <Link href={linkResolver('lifeevents').href} skipTab>
              <Button
                icon="arrowForward"
                iconType="filled"
                variant="text"
                as="span"
              >
                {seeMoreText}
              </Button>
            </Link>
          </Box>
        </Box>
      </GridContainer>
      <GridItems
        mobileItemWidth={215}
        mobileItemsRows={1}
        paddingTop={4}
        paddingBottom={3}
        insideGridContainer
        third
      >
        {items
          .slice(0, 6)
          .filter((x: { slug: string; title: string }) => x.slug && x.title)
          .map((lifeEvent, index: number) => {
            return (
              <CardWithFeaturedItems
                key={index}
                heading={lifeEvent.shortTitle || lifeEvent.title}
                imgSrc={lifeEvent.tinyThumbnail?.url ?? ''}
                alt={lifeEvent.tinyThumbnail?.title ?? ''}
                dataTestId={'lifeevent-card-with-featured-items'}
                href={
                  linkResolver(lifeEvent.__typename as LinkType, [
                    lifeEvent.slug,
                  ]).href
                }
                featuredItems={lifeEvent.featured}
                buttonTitle={
                  lifeEvent.seeMoreText && lifeEvent.seeMoreText !== ''
                    ? lifeEvent.seeMoreText
                    : 'Skoða lífsviðburð'
                }
              />
            )
          })}
      </GridItems>
      <Hidden above="md">
        <GridContainer>
          <Box
            display="flex"
            width="full"
            justifyContent="center"
            alignItems="center"
            paddingY={[3, 3, 3, 0]}
          >
            <Link skipTab href={linkResolver('lifeevents').href}>
              <Button
                icon="arrowForward"
                iconType="filled"
                variant="text"
                as="span"
              >
                {seeMoreText}
              </Button>
            </Link>
          </Box>
        </GridContainer>
      </Hidden>
    </>
  )
}

export default LifeEventsSection
