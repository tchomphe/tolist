import React from 'react';
import NavigationHeader from './NavigationHeader';
import PostWindow from './PostWindow';
import FloatingBackButton from './FloatingBackButton';
import PostTile from './PostTile';
import Request from 'superagent';

export default class MyPostPage extends React.Component {
    constructor(props){
        super(props);

        //define state variables
        this.state = {
            postModal: <PostWindow title="TEST title" price="TEST price" address="TEST address" description="TEST description" />,
            displayedPosts: null,
        };
    }

    componentWillMount(){
        Request.get('/searchByOwner').then((res) => {
            console.log(res.body);
            var userPosts = res.body.map((post) =>
                <PostTile updatePostModal={this.updatePostModal} post={post} key={post._id} id={post._id} title={post.title} address={post.address} />
            );

            this.setState({
                displayedPosts: userPosts,
            });
        });
    }

    render(){
        return (
            <div className="app-content row center">
                <NavigationHeader authorizedUser={true} searchPost={null} />
                <h4 className="profilePageHeader">My Posts</h4>
                {this.state.displayedPosts}
                <FloatingBackButton />
                {this.state.postModal}
            </div>
        )
    }
}