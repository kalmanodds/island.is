import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_SINGLE_EVENT_QUERY = gql`
  query GetSingleEvent($input: GetSingleEventInput!) {
    getSingleEvent(input: $input) {
      title
      slug
      date
      intro
      image {
        url
        title
        width
        height
      }
      fullWidthImageInContent
      content {
        ...AllSlices
      }
      featuredImage {
        url
        title
        width
        height
      }
    }
  }
  ${slices}
`

export const GET_EVENTS_QUERY = gql`
  query GetEvents($input: GetEventsInput!) {
    getEvents(input: $input) {
      total
      items {
        id
        title
        slug
        date
        intro
        image {
          url
          title
          width
          height
        }
      }
    }
  }
`
