import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import CommentItem from '../components/commentItem/commentItem'

const DELETE_COMMENTS = gql`
  mutation deleteComment($commentId: String, $userId: String){
    deleteComment(commentId: $commentId, userId: $userId)
  }`

const mapMutaionToProps = graphql(
  DELETE_COMMENTS,
  {
    props:({mutate})=>({
      deleteComment : (commentId, userId) =>mutate({variables:{commentId, userId}})
    })
  }
);

const CommentItemContain = mapMutaionToProps(CommentItem);
export default CommentItemContain;
