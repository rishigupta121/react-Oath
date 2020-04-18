import React from "react";
import * as Croppie from 'croppie';

class ImagePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            croppieRef: React.createRef(),
            croppie: '',
        };
    }

    componentWillUnmount() {
        if (this.state.croppie) {
            this.state.croppie.destroy();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.reloadPicker !== prevProps.reloadPicker) {
            this.forceUpdate(); //todo this doesn't work
        }
    }

    handleFiles(files) {
        if (this.state.croppie) {
            this.state.croppie.destroy();
        }

        var url = URL.createObjectURL(files[0]);
        var boundary;
        if (!this.props.boundary) {
            boundary = {};
            boundary.width = 400;
            boundary.height = 400;
        } else {
            boundary = this.props.boundary;
        }
        var viewport;
        if (!this.props.viewportSize) {
            viewport = {};
            viewport.width = 300;
            viewport.height = 252;
        } else {
            viewport = this.props.viewportSize;
        }
        this.setState({
            croppie: new Croppie(this.state.croppieRef.current, {
                url: url,
                viewport: {
                    width: viewport.width,
                    height: viewport.height,
                    type: 'square'
                },
                boundary: {
                    width: boundary.width,
                    height: boundary.height,
                }
            })
        }, this.setCroppie);
    }

    setCroppie() {
        this.props.setCroppie(this.state.croppie);
    }

    loadPreviousImage() {
        return <div>
            <label className="width-100">
                <img src={this.props.imageUrl}/>
            </label>
            <button className="btn btn-primary" type="button" onClick={() => this.props.resetImage()}>
                Select an other {this.props.name}
            </button>
        </div>
    }

    loadImageSelecter() {
        return <div>
            <label className="width-100">
                <label className="btn btn-primary">
                    Select {this.props.name}
                    <input type="file" name="image"
                           accept="image/*" value={this.props.imageUrl}
                           onChange={(e) => this.handleFiles(e.target.files)}/>
                </label>
            </label>
            <div id="croppie_container">
                <div ref={this.state.croppieRef}>
                </div>
            </div>
        </div>
    }

    render() {
        return <div>
            {this.props.imageUrl ? this.loadPreviousImage() :
                this.loadImageSelecter()}</div>

    }
}

export default ImagePicker;