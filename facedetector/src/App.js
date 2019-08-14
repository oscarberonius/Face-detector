import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';


const app = new Clarifai.App({
    apiKey: 'cd9d6dab77b8408c976e6e57e76e130b'
});


const particleOptions = {
    particles: {
        number: {
            value: 150,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            user: {
                name: '',
                email: '',
                id: '',
                entries: 0,
                creationdate: ''
            }
        }
    }

    loadUser = (data) => {
        this.setState({
            user: {
                name: data.name,
                email: data.email,
                id: data.id,
                entries: data.entries,
                creationdate: data.creationdate
            }
        })
    }

    componentDidMount() {
        fetch("http://localhost:3000/").then(res => res.json()).then(console.log)
    }

    calculateFaceLocation = (data) => {
        const boundingBox = data.outputs[0].data.regions[0].region_info.bounding_box
        const image = document.getElementById('faceImage');
        const width = Number(image.width);
        const height = Number(image.height);

        return {
            leftCol: boundingBox.left_col * width,
            topRow: boundingBox.top_row * height,
            rightCol: width - boundingBox.right_col * width,
            bottomRow: height - boundingBox.bottom_row * height
        }
    }

    displayFaceBox = (box) => {
        this.setState({ box: box });
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit = (event) => {
        this.setState({ imageUrl: this.state.input });
        app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then(response => {
                if (response) {
                    fetch("http://localhost:3000/image", {
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, { entries: count }))
                        })
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err))
    }

    onRouteChange = (route) => {
        this.setState({ route: route });
    }

    render() {
        return (
            <div className="App">
                <Particles className="particles" params={particleOptions} />
                {
                    this.state.route === 'home' ?
                        <div>
                            <Navigation onRouteChange={this.onRouteChange} />
                            <Logo />
                            <Rank name={this.state.user.name} entries={this.state.user.entries} />
                            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                            <FaceRecognition imageUrl={this.state.imageUrl} faceBox={this.state.box} />
                        </div>
                        :
                        (
                            this.state.route === 'signin' ?
                                <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                                :
                                <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

                        )
                }
            </div>
        );
    }
}

export default App;
