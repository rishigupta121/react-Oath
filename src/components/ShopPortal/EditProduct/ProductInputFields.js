import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";
import AddExtraAtrributes from "./AddExtraAttributes";
import ImagePicker from "../ImagePicker/ImagePicker";
import SelectProduct from "./SelectProduct";

class ProductInputFieldsBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            price: '',
            categoryId: '',
            croppie: '',
            croppieThumbnail: '',
            imageUrl: '',
            imageUrlThumbnail: '',
            posId: '',
            reloadImage: false,
            reloadImageThumbnail: false,
            productId: '',
            extraAttributes: [{name: '', priceDifference: 0, increase: true, id: 0}],
            countImagesToUploaded: 0,
            addAttribute: false,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    addExtraAttribute() {
        var extraAttributes = this.state.extraAttributes;
        extraAttributes.push({name: '', priceDifference: 0, increase: false, id: extraAttributes.length});
        this.setState({
            ["extraAttributes"]: extraAttributes,
            addAttribute: true
        });
    }

    resetAddExtraAttribute() {
        this.setState({
            addAttribute: false
        });
    }

    handleChange(event) {
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        var name = target.name;

        if (name.startsWith("extraAttribute_")) {
            name = name.replace('extraAttribute_', '');
            var extraAttributes = this.state.extraAttributes;
            extraAttributes[target.id][name] = value;
            this.setState({
                ["extraAttributes"]: extraAttributes
            });
        } else {
            this.setState({
                [name]: value
            });
        }
    }

    handleSubmit() {
        // Remove the empty extra attributes and check validate remaining
        var removeAttributes = [];
        for (var key in this.state.extraAttributes) {
            if (!this.state.extraAttributes.hasOwnProperty(key)) {
                break;
            }
            var extraAttribute = this.state.extraAttributes[key];
            if (extraAttribute.name === '') {
                removeAttributes.push(key); //remove after the loop
            }
        }
        var extraAttributes = this.state.extraAttributes;
        for (var key in removeAttributes) {
            extraAttributes.splice(removeAttributes[key], 1);
        }
        if (!extraAttributes) {
            extraAttributes = "";
        }
        // The handleSubmit 2 is called after the set state is complete (async)
        this.setState({
                ["extraAttributes"]: extraAttributes
            },
            this.handleSubmit2
        );
    }

    handleSubmit2() {
        var errorMessage = this.validateData(this.state);
        if (errorMessage !== '') {
            alert(errorMessage);
            return;
        }

        var path = DATABASE + "/restaurants/" + this.props.currentRestaurantId + "/products/";
        var key;
        if (this.props.isEdit) {
            key = this.state.productId;
        } else {
            key = this.props.firebase.db.ref().child(path).push().key;
        }
        let countImages = 0;
        if (this.state.croppieThumbnail !== '') countImages += 1;
        if (this.state.croppie !== '') countImages += 1;
        this.setState({countImagesToUploaded: countImages}, () => this.handleSubmit3(key, path));
    }

    handleSubmit3(key, path) {
        if (this.state.croppie !== '') {
            this.uploadImage(this.state, this.state.croppie, key, path, false)
        }
        if (this.state.croppieThumbnail !== '') {
            this.uploadImage(this.state, this.state.croppieThumbnail, key, path, true)
        }
        if (this.state.croppieThumbnail === '' && this.state.croppie === '') {
            this.uploadProduct(this.state, key, path);
        }
    }

    uploadImageDone(key, path) {
        if (this.state.countImagesToUploaded === 0) {
            this.uploadProduct(this.state, key, path);
        }
    }

    // TODO move this to a validate javascript class
    validateData(state) {
        if (state.name === '') {
            return "No name specified";
        }
        if (state.price === '') {
            return "No price specified";
        } else if (isNaN(state.price)) {
            return "Specified price is not a number";
        }
        if (state.categoryId === '') {
            return "No category selected";
        }
        for (var key in state.extraAttributes) {
            if (!state.extraAttributes.hasOwnProperty(key)) {
                break;
            }
            var extraAttribute = state.extraAttributes[key];
            if (extraAttribute.priceDifference === '') {
                return "No price specified for an extra attribute";
            } else if (isNaN(extraAttribute.priceDifference)) {
                return "Specified price for an extra attribute is not a number";
            }
        }
        return '';
    }

    //TODO move key to the state it's used everywhere
    uploadImage(state, croppie, key, path, isThumbnail) {
        var blobImage = croppie.result('blob').then(blob => {
            return blob;
        });
        blobImage.then(blob => {
            var storageRef = this.props.firebase.storage.ref();
            var imageRef;
            if (isThumbnail) {
                imageRef = storageRef.child(key + "Thumbnail");
            }else{
                imageRef = storageRef.child(key);
            }
            imageRef.put(blob).then(snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
                    if (isThumbnail) {
                        this.setState({
                                countImagesToUploaded: this.state.countImagesToUploaded - 1,
                                imageUrlThumbnail: url
                            },
                            () => this.uploadImageDone(key, path));
                    } else {
                        this.setState({countImagesToUploaded: this.state.countImagesToUploaded - 1, imageUrl: url},
                            () => this.uploadImageDone(key, path));
                    }
                }).catch(error => {
                    console.log(error);
                });
            });
        });
    }

    uploadProduct(state, key, path) {
        this.props.firebase.db.ref(path + key).set({
            name: state.name,
            imageUrl: state.imageUrl,
            imageUrlThumbnail: state.imageUrlThumbnail,
            id: key,
            categoryId: state.categoryId,
            price: state.price,
            posId: state.posId,
            description: state.description,
            extraAttributes: state.extraAttributes
        }).then(error => {
            this.setState({
                name: '',
                description: '',
                price: '',
                categoryId: '',
                croppie: '',
                posId: '',
                croppieThumbnail: '',
                imageUrl: '',
                imageUrlThumbnail: '',
                reloadImage: !this.reloadImage,
                reloadImageThumbnail: !this.reloadImageThumbnail,
                productId: '',
                extraAttributes: [{name: '', priceDifference: 0, increase: true, id: 0}],
            });

        });
    }


    getCategoriesAsOptions(categories) {
        var categoryList = [];
        categoryList.push(
            <option key="-1" value="">Select category</option>
        );
        for (var categoryId in categories) {
            var category = categories[categoryId];
            categoryList.push(
                <option key={category.id} value={category.id}>{category.name}</option>
            );
        }
        return categoryList;
    }

    setCroppie(isThumbnail, croppie) {
        if (isThumbnail) {
            this.setState({croppieThumbnail: croppie});
        } else {
            this.setState({croppie: croppie});
        }
    }

    setProduct(productId) {
        this.setState({productId: productId});
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.currentRestaurantId + '/products/' + productId).on('value', snapshot => {
            var product = snapshot.val();
            var extraAttribute = product.extraAttributes;
            if (!extraAttribute) {
                extraAttribute = [];
            }
            this.setState({
                name: product.name,
                description: product.description ? product.description : '',
                extraAttributes: extraAttribute,
                price: product.price,
                posId: product.posId ? product.posId : '',
                categoryId: product.categoryId ? product.categoryId : '',
                imageUrl: product.imageUrl ? product.imageUrl : '',
                imageUrlThumbnail: product.imageUrlThumbnail ? product.imageUrlThumbnail : '',
            });
        });
    }

    resetImage(isThumbnail) {
        if (isThumbnail) {
            this.setState({
                imageUrlThumbnail: '',
                reloadImageThumbnail: !this.reloadImageThumbnail,
            });
        } else {
            this.setState({
                imageUrl: '',
                reloadImage: !this.reloadImage,
            });
        }
    }

    render() {
        return (
            <div>
                {this.props.isEdit ? <SelectProduct setProduct={(productId) => this.setProduct(productId)}
                                                    currentRestaurantId={this.props.currentRestaurantId}/> : null}
                <form>
                    <label className="width-100">
                        Name:
                        <input className="form-control" type="text" name="name" value={this.state.name}
                               onChange={this.handleChange}/>
                    </label>
                    <label className="width-100">
                        Short description:
                        <input className="form-control" type="text" name="description"
                               value={this.state.description}
                               onChange={this.handleChange}/>
                    </label>
                    <label className="width-100">
                        Price:
                        <input className="form-control" type="text" name="price" value={this.state.price}
                               placeholder="2.50" onChange={this.handleChange}/>
                    </label>
                    <label className="width-100">
                        Category:
                        <select className="browser-default custom-select mt-2" name="categoryId"
                                value={this.state.categoryId} onChange={this.handleChange}>
                            {this.getCategoriesAsOptions(this.props.categories)}
                        </select>
                    </label>
                    <label className="width-100">
                        <AddExtraAtrributes extraAttributes={this.state.extraAttributes}
                                            handleChange={this.handleChange}
                                            addExtraAttribute={() => this.addExtraAttribute()}
                                            resetAddExtraAttribute={() => this.resetAddExtraAttribute()}
                                            addAttribute={this.state.addAttribute}/>
                    </label>
                    <label className="width-100 font-weight-bold">
                        Select an image:
                    </label>
                    <ImagePicker imageUrl={this.state.imageUrl} resetImage={() => this.resetImage(false)}
                                 name="Product Image" reloadPicker={this.state.reloadImage}
                                 setCroppie={(croppie) => this.setCroppie(false, croppie)}/>
                    <ImagePicker imageUrl={this.state.imageUrlThumbnail} resetImage={() => this.resetImage(true)}
                                 name="Thumbnail"
                                 viewportSize={{width: 200, height: 200}} reloadPicker={this.state.reloadImageThumbnail}
                                 setCroppie={(croppie) => this.setCroppie(true, croppie)}/>
                </form>
                <button className="btn btn-raised btn-primary" type="button"
                        onClick={() => this.handleSubmit()}>{this.props.isEdit ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        );
    }
}

const ProductInputFields = compose(
    withRouter,
    withFirebase,
)(ProductInputFieldsBase);

export default ProductInputFields;