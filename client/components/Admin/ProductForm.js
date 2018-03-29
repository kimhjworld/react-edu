import React, { Component } from 'react';
import axios from 'axios';

class ProductForm extends Component {

    constructor(){
        super();
        this.state = {
            method : "post",
            action : "/api/admin/products",
            product_name : "",
            price : "",
            sale_price : "",
            description : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    componentDidMount() {  //write or edit 분기처리
        let urlSecondPath = this.props.location.pathname.split('/')[3];
        let productId = this.props.match.params.id;

        if(urlSecondPath==='edit'){ //url 이 edit가 들어가면 이전폼 양식을 그대로 받아와서 셋팅
            axios.get(`/api/admin/products/${productId}`, {
            }).then( (res) => {
                this.setState({
                    method : "put",
                    action : `/api/admin/products/${productId}`,
                    product_name : res.data.product.product_name,
                    price : res.data.product.price,
                    sale_price : res.data.product.sale_price,
                    description : res.data.product.description
                });
            }).catch( (error) => {
                console.log(error);
            });
        }
    }

    handleFile(event){ //onChange Event bind 된거
        this.setState({thumbnail:event.target.files[0]})
    }

    handleChange(event){
        let result = {};
        result[event.target.name] = event.target.value;
        this.setState(result);
    }


    handleSubmit(event){
        event.preventDefault();
        if(!this.state.product_name){
            alert("제품명을 입력하세요.");
            this.refs.product_nameRef.focus();
            return;
        }
        if(!this.state.price && !this.state.sale_price ){
            alert("가격 또는 할인가를 입력하세요.");
            return;
        }

	//file data 를 ajax로 처리하기위해 formData 로 ... (html5 만  formData 지원함 ie10 부터 ... )
        const formData = new FormData();
        formData.append('product_name', this.state.product_name);
        formData.append('thumbnail', this.state.thumbnail);
        formData.append('price', this.state.price);
        formData.append('sale_price', this.state.sale_price);
        formData.append('description', this.state.description);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios({
            method : this.state.method,  //평상시 post 수정할 땐 put
            url : this.state.action,
            //data : {
            //	  product_name : this.state.product_name,
            //	  price : this.state.price,
            //	  sale_price : this.state.sale_price,
            //	  description : this.state.description
            //	},
		        data : formData,
            config : config
        }).then( (res) => {
            if(res.data.message==="success"){
                alert('작성되었습니다.');
                this.props.history.push('/admin/products');
            }
        }).catch( (error) => {
            console.log(error);
        });

    }


    render() {
        return (
            <div>
                <form action="" method="post" onSubmit={this.handleSubmit}>
                    <h3>제품등록</h3>
                    <table className="table table-bordered table-hover">
                        <tbody>
                            <tr>
                                <th>제품명</th>
                                <td>
                                    <input type="text" className="form-control" name="product_name" ref="product_nameRef" value={this.state.product_name} onChange={this.handleChange} />
                                </td>
                            </tr>
                            <tr>
                                <th>제품이미지</th>
                                <td>
                                    <input type="file" name="thumbnail" onChange={this.handleFile}/>
                                </td>
                            </tr>
                            <tr>
                                <th>가격</th>
                                <td>
                                    <input type="text" className="form-control" style={{ width : "15%" }}  name="price"  value={this.state.price} onChange={this.handleChange}/>
                                </td>
                            </tr>
                            <tr>
                                <th>할인가</th>
                                <td>
                                    <input type="text" className="form-control" style={{ width : "15%" }} name="sale_price"  value={this.state.sale_price} onChange={this.handleChange}/>
                                </td>
                            </tr>
                            <tr>
                                <th>설명</th>
                                <td>
                                    <textarea className="form-control" name="description" onChange={this.handleChange} value={this.state.description}></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="btn btn-primary">작성하기</button>
                </form>
            </div>
        );
    }
}

export default ProductForm;
