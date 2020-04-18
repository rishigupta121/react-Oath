import React from "react";
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {GithubPicker} from 'react-color'
import DATABASE from "../../Database";
import ImagePicker from "../ImagePicker/ImagePicker";
import PickedColor from "./PickedColor";
import * as ROUTES from "../../../constants/routes";


class EditRestaurant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantName: '',
            restaurantId: '',
            restaurantColor: '',
            imageUrl: '',
            isPublic: false,
            croppie: '',
            userId: this.props.userId,
            possibleRestaurantOwners: [],
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (!this.props.newRestaurant) {
            this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.currentRestaurantId).on('value', snapshot => {
                this.setState({
                    restaurantName: snapshot.val().name,
                    restaurantId: snapshot.val().id,
                    restaurantColor: snapshot.val().color,
                    isPublic: snapshot.val().isPublic ? snapshot.val().isPublic : false,
                    imageUrl: snapshot.val().imageUrl ? snapshot.val().imageUrl : '',
                });
            });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    validateData() {
        let errorMessage = '';
        let state = this.state;
        if (state.restaurantName === '') {
            errorMessage = "No restaurant name specified";
        }
        if (!this.validTextColour(state.restaurantColor)) {
            errorMessage = "Color is not valid.";
        }

        this.props.firebase.db.ref(DATABASE + '/restaurants/' + state.restaurantId).once('value', snapshot => {
            //Check if we are creating a new restaurant and the id is taken already
            if (snapshot.val() && this.props.newRestaurant) {
                errorMessage = "This id is already taken";
            }

            if (errorMessage !== '') {
                alert(errorMessage);
            } else {
                this.handleSubmit();
            }

        });
    }

    validTextColour(stringToTest) {
        //Alter the following conditions according to your need.
        if (stringToTest === "" || stringToTest === undefined) {
            return true;
        }
        if (stringToTest === "inherit") {
            return false;
        }
        if (stringToTest === "transparent") {
            return false;
        }

        var image = document.createElement("img");
        image.style.color = "rgb(0, 0, 0)";
        image.style.color = stringToTest;
        if (image.style.color !== "rgb(0, 0, 0)") {
            return true;
        }
        image.style.color = "rgb(255, 255, 255)";
        image.style.color = stringToTest;
        return image.style.color !== "rgb(255, 255, 255)";
    }

    handleSubmit() {
        if (this.state.restaurantId === '') {
            this.setState({restaurantId: this.props.firebase.db.ref().child(DATABASE + "/restaurants/").push().key},
                this.handleSubmit2);
        } else {
            this.handleSubmit2();
        }
    }

    handleSubmit2() {
        if (this.state.croppie !== '') {
            this.uploadImageAndRestaurant(this.state);
        } else {
            this.updateRestaurant(this.state);
        }
    }

    updateRestaurant(state) {
        var path = DATABASE + "/restaurantOwners/" + state.userId;
        this.props.firebase.db.ref(path + '/restaurants/' + state.restaurantId).set(state.restaurantId).then(snapshot => {
            console.log("restaurant owner written created");
        });
        this.props.firebase.db.ref(path + '/currentRestaurant/').set(state.restaurantId).then(snapshot => {
            console.log("set as current restaurant");
        });
        var restaurant = {
            name: state.restaurantName,
            id: state.restaurantId,
            color: state.restaurantColor ? state.restaurantColor : '',
            isPublic: state.isPublic,
        };
        if (state.imageUrl) {
            restaurant.imageUrl = state.imageUrl;
        }
        console.log(restaurant);
        this.props.firebase.db.ref(DATABASE + "/restaurants/" + state.restaurantId).update(restaurant).then(snapshot => {
            this.props.history.push({
                pathname: ROUTES.SHOP_PORTAL.BASE_NAME
            });
        });
    }

    uploadImageAndRestaurant(state) {
        var blobImage = this.state.croppie.result('blob').then(blob => {
            return blob;
        });

        blobImage.then(blob => {
            var storageRef = this.props.firebase.storage.ref();
            var imageRef = storageRef.child(state.restaurantId);
            imageRef.put(blob).then(snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
                    state.imageUrl = url;
                    this.updateRestaurant(state);
                }).catch(function (error) {
                    console.log(error);
                });
            });
        });
    }

    listRestaurantOwners() {
        return <div></div>
    }

    getUsersAsOptions() {
        var categoryList = [];
        categoryList.push(
            <option key="-1" value="-1">Select category</option>
        );
        for (var categoryId in this.props.categories) {
            var category = this.props.categories[categoryId];
            categoryList.push(
                <option key={category.id} value={category.id}>{category.name}</option>
            );
        }
        categoryList.push(
            <option key="none" value="">No category at all</option>
        );
        return categoryList;
    }

    setImageBlob(imageBlob) {
        this.setState({imageBlob: imageBlob});
    }

    setCroppie(croppie) {
        this.setState({croppie: croppie});
    }

    resetImage() {
        this.setState({imageUrl: ''});
    }

    publicText(isPublic) {
        if (isPublic) {
            return <span className="text-primary ml-1">Accessible for everyone</span>;
        } else {
            return <span className="text-primary ml-1">Private, restaurant owners have access</span>;
        }
    }

    onChangeColorComplete(color) {
        console.log(color);
        this.setState({"restaurantColor" : color.hex})
    }

    render() {
        return (
            <div className="m-3">
                <h4>
                    {this.props.newRestaurant ? "Create new restaurant" : "Edit restaurant"}
                </h4>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <label className="width-100">
                                Name of the restaurant:
                                <input className="form-control" type="text" name="restaurantName"
                                       value={this.state.restaurantName}
                                       onChange={this.handleChange}/>
                            </label>
                            {this.props.newRestaurant ?
                                <label className="width-100">
                                    Unique identifier of the restaurant (optional):
                                    <input className="form-control" type="text" name="restaurantId"
                                           value={this.state.restaurantId}
                                           placeholder="bobs-burgers-delft"
                                           onChange={this.handleChange}/>
                                </label> : ""}
                            <label className="width-100">
                                New color of the restaurant:
                                <PickedColor color={this.state.restaurantColor} />
                                <GithubPicker colors={['#288e44', '#8dc540', '#ffc20f', '#f37a1f', '#eb1c24', '#c6151d', '#842e6b', '#1e196d', '#5c2d93', '#024a92', '#019ad3', '#000000']}
                                              onChangeComplete={(color) => this.onChangeColorComplete(color)}/>
                                {/*<input className="form-control" type="text" name="restaurantColor"*/}
                                {/*       placeholder="red, blue, #32A879"*/}
                                {/*       value={this.state.restaurantColor}*/}
                                {/*       onChange={this.handleChange}/>*/}
                            </label>
                            <label className="width-100 form-control">
                                <input type="checkbox"
                                       name="isPublic"
                                       checked={this.state.isPublic}
                                       value={this.state.isPublic}
                                       onChange={this.handleChange}/>
                                {this.publicText(this.state.isPublic)}
                            </label>
                            <ImagePicker name="Select Restaurant Logo" imageUrl={this.state.imageUrl}
                                         resetImage={() => this.resetImage()}
                                         setCroppie={(croppie) => this.setCroppie(croppie)}/>
                        </form>
                        <button className="btn btn-raised btn-primary" type="button"
                                onClick={() => this.validateData()}>{this.props.newRestaurant ? "Create" : "Update"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const EditRestaurantPage = compose(
    withRouter,
    withFirebase,
)(EditRestaurant);

export default EditRestaurantPage;