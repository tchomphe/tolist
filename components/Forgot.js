import React from 'react';
import Request from 'superagent';
import InputField from './InputField';
import { Link, withRouter } from 'react-router-dom';

class Forgot extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: "",
            err: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount(){
        $('.modal').modal();
        $('.tooltipped').tooltip({delay: 50});

    }

    handleInputChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(e){
        e.preventDefault();
        Request
            .post('/forgot')
            .send({email: this.state.email})
            .end(function(err, res){
                if(err) {
                    Materialize.toast('Error! Message could not be sent!', 4000);
                } else {
                    Materialize.toast('An email with reset link has been sent!', 4000);
                }
            });
    }
    render(){
        return(
                <div className="col s12 m7 center ">
                    <div className="card large">
                        <div className="container">
                            <div className="card-content left-align">
                            <form onSubmit={(e) => this.onSubmit(e)} >
                            <span className="card-title">Forgot your password?</span>
                            <p>We can send you a password reset link</p>
                            <InputField labelText="Enter your email" labelSuccess="" labelError={(this.state.err)?this.state.err:"Enter a valid email address"}
                                id="email" type="email" onChange={this.handleInputChange} value={this.state.email} required="" aria-required="true" />
                                {/* <input id="email" name="email" type="text" ref="email" placeholder="Enter your email" required="" aria-required="true" /> */}
                                <div className="card-action right-align" style={{'padding-right':'20px'}}>
                                    <button className="btn black waves-effect waves-light" type="submit">Send</button>
                                    {/* <a href="#">This is a link</a> */}
                                </div>
                            </form>
                        </div>
                        </div>
                    </div>
                </div>
        )
    }
}
export default Forgot;