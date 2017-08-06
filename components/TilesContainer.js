import React from 'react';
import PostTile from './PostTile';
import NavigationHeader from './NavigationHeader';
import RegistrationWindow from './RegistrationWindow';
import LoginWindow from './LoginWindow';
import PostWindow from './PostWindow';
import FloatingBackButton from './FloatingBackButton';
import Banner from './Banner';
import Request from 'superagent';

export default class TilesContainer extends React.Component {
    constructor(props){
        super(props);

        //define state variable holding data for Tiles
        this.state = {
            postModal: <PostWindow title="TEST title" price="TEST price" address="TEST address" description="TEST description" />,
            displayedPosts: [],
            page: 1,
            authorizedUser: false,
        };

        //bind functions to this component
        this.getPosts = this.getPosts.bind(this);
        this.searchPost = this.searchPost.bind(this);
        this.resetPosts = this.resetPosts.bind(this);
        this.updatePostModal = this.updatePostModal.bind(this);
    }

    componentWillMount(){
        this.getPosts();
    }

    getPosts(){
        //send GET request to API and update state with response
        Request.get('/paginatePosts/'+this.state.page).then((res) => {
            var oldPosts = this.state.displayedPosts;
            var newPosts = res.body.docs.map((post) =>
                    <PostTile updatePostModal={this.updatePostModal} post={post} key={post._id} id={post._id} title={post.title} address={post.address} />
                );
            var updatedPosts = oldPosts.concat(newPosts);

            this.setState({
                displayedPosts: updatedPosts,
                page: this.state.page + 1,
                authorizedUser: (res.header.authorized_user == 'true'),
            })
        });
    }

    searchPost(title){
        Request.get('/searchByTitle/' + title).then((res) => {
            this.setState({
                displayedPosts: res.body.docs.map((post) =>
                    <PostTile updatePostModal={this.updatePostModal} post={post} key={post._id} id={post._id} title={post.title} address={post.address} />
                ),
            })
        });
    }

    updatePostModal(post){
        //pass information about the (user-selected) post to the modal
        this.setState({
            postModal: <PostWindow title={post.title} price={post.price} address={post.address} description={post.description} />
        });

        //display the modal on the screen
        $('#postModal').modal('open');
    }

    render(){
        console.log('Rendered TilesContainer ' + this.state.displayedPosts);
        return(
            <div className="app-content row center">
                <NavigationHeader authorizedUser={this.state.authorizedUser} searchPost={this.searchPost} resetPosts={this.resetPosts}/>
                <Banner />
                <RegistrationWindow />
                <LoginWindow />
                {this.state.postModal}
                {this.state.displayedPosts}
                <br />
                <a onClick={this.getPosts} className="scrollButton btn-floating btn-large waves-effect waves-light gray">
                    <i className="large material-icons">expand_more</i>
                </a>
            </div>
        );
    }
}