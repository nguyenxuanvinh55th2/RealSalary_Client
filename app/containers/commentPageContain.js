import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import CommentPage from '../components/commentPage/commentPage'
import { decrypted } from '../aesCrypt'

const COMMENTS = gql`
  query comments($postId: String, $offset: Int, $limit: Int){
    comments(postId: $postId, offset: $offset, limit: $limit) {
      _id
    	text
      userId
      user {
        _id
        name
        image
      }
    },
  }`

const INSERT_COMMENTS = gql`
  mutation insertComment($text: String, $userId: String, $postId: String){
    insertComment(text: $text, userId: $userId, postId: $postId)
  }`

let ITEMS_PER_PAGE = 3;

const mapDataToProps = graphql(COMMENTS, {
  options: (props) => {
    let decryptedString = decrypted(props.params.info);
    let info = JSON.parse(decryptedString);
    console.log("info", info);
    return {
      variables: {
        postId: info.postId,
        offset: 0,
        limit: ITEMS_PER_PAGE
      },
      forceFetch: true
    }
  },
  props: ({ ownProps, data: { loading, comments, refetch, subscribeToMore, fetchMore} }) => ({
   loading,
   comments,
   refetchPost: refetch,
   subscribeToMore:subscribeToMore,
   loadMoreEntries() {
      return fetchMore({
        // query: ... (you can specify a different query. FEED_QUERY is used by default)
        variables: {
          // We are able to figure out which offset to use because it matches
          // the feed length, but we could also use state, or the previous
          // variables to calculate this (see the cursor example below)
          offset: comments.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.data) { return previousResult; }
          return Object.assign({}, previousResult, {
            // Append the new feed results to the old one
            comments: [...previousResult.comments, ...fetchMoreResult.data.comments],
          });
        },
      });
    },
  }),
})

const mapMutationToProps = graphql(INSERT_COMMENTS,
  {
    props:({mutate})=>({
      insertComment : (text, userId, postId) =>mutate({variables:{text, userId, postId}})
    })
  }
);

const CommentPageContain = mapDataToProps(mapMutationToProps(CommentPage));
export default CommentPageContain;
