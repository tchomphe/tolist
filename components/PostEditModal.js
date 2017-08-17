import React from 'react';
import FloatingBackButton from './FloatingBackButton';
import Request from 'superagent';

class PostEditModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            err:"",
            title:"",
            address:"",
            price:"",
            description:""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }
    handleInputChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    handleSubmit(event){   
        
        Request            
            .put('/post/' + this.props.pid)
            .send({title: this.state.title, price: this.state.price, address: this.state.price, description: this.state.description})
            .end((err, res) => {
                if(err){
                    this.setState({err: res.body.error});                    
                } else {
                    this.setState({err: ""});
                    $('#postEditModal').modal('close');
                }
            });    
            event.preventDefault(); 
    }
    render(){        
        return(
            <div id="postEditModal" className="modal">
                <div className="modal-content">                        
                    <div className="card-panel">
                        {/* <form method="post" action="/createPost" encType="multipart/form-data"> */}
                        <form onSubmit={this.handleSubmit}>                            
                            <div className="row">
                                <label htmlFor="title">Title:</label>
                                <input placeholder={this.props.title} name="title" value={this.state.title} type="text" className="validate" onChange={this.handleInputChange} />
                            </div>
                            <div className="row">
                                <label htmlFor="price">Price:</label>
                                <input placeholder={this.props.price} name="price" value={this.state.price} type="text" className="validate" onChange={this.handleInputChange} />
                            </div>
                            <div className="row">
                                <label htmlFor="address">Address:</label>
                                <input placeholder={this.props.address} name="address" value={this.state.address} type="text" className="validate" onChange={this.handleInputChange} />
                            </div>
                            <div className="row">
                                <label htmlFor="description">Description:</label>
                                <input placeholder={this.props.description} name="description" value={this.state.description} type="text" className="validate" onChange={this.handleInputChange} />
                            </div>
                            {/* <div className="row">
                                <div className="col s12 file-field input-field">
                                    <div className="btn">
                                        <span>Browse</span>
                                        <input type="file" name="postImages" multiple/>
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input className="file-path validate" type="text" placeholder="Upload new pictures" />
                                    </div>
                                </div>
                            </div> */}
                            <div className="row">
                                <div className="s12">
                                     <button className="btn waves-effect waves-light" type="submit" value="Submit">Update</button> 
                                    {/* <input type="submit" value="Submit" /> */}

                                </div>
                            </div>
                        </form>
                    </div>                                            
                </div>
            </div>
        );
    }
}

export default PostEditModal;