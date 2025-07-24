import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import * as CryptoJS from 'crypto-js'




@Injectable({
    providedIn: 'root'
})
export class Global {

    private apiendpoint: string = 'http://localhost:1339/api/';

    private apiendpoint_sit: string = 'http://localhost:1338/api/';

    // https://webdev2.neweltechnologies.in:1339/api/


    private apiendpoint_uat: string = 'https://webdev2.neweltechnologies.in:1339/api/';

    private apiendpoint_live: string = 'http://localhost:1337/api/';

    private apiDigitalResponseEndpoint: string = '';

    getDigitalapiendpoint() { return this.apiDigitalResponseEndpoint; }

    //  getapiendpoint() { return this.apiendpoint; }

    getapiendpoint() { return this.apiendpoint_uat; }

    getUIObj(path1: any) {
        let jwt_token = sessionStorage.getItem('jwt_token');
        let decodedData: any = this.decrypt(jwt_token);

        var menudata = JSON.parse(sessionStorage.getItem("menuItems")!);
        // console.log("menudata11", menudata);

        for (var item = 0; item < menudata.length; item++) {
            if (menudata[item].path === path1) {
                return menudata[item];
            }
        }
        return null;
    }

    decrypt(encryptedString: any) {

        let plainText = jwtDecode(encryptedString);
        return plainText;

    }


    encryptionAES(code: any) {

        var ciphertext = CryptoJS.AES.encrypt(code, 'newel');

        return ciphertext.toString();

    }
    
    decrypt1(value: any) {

        //   console.log("plain", value)
        const bytes = CryptoJS.AES.decrypt(value, 'newel');

        const plaintext = bytes.toString(CryptoJS.enc.Utf8);

        //  console.log("plain", plaintext)

        return plaintext;


    }



    // IsCentralAccess()
    // {
    //     var userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn'));
    //     var role = userLoggedIn.UserRoles.find(o => o.RoleId == userLoggedIn.DefaultRoleId);
    //     if(role.Role.IsCentralAccess){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }

    // IsLOBWiseAccess()
    // {
    //     var userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn'));
    //     var role = userLoggedIn.UserRoles.find(o => o.RoleId == userLoggedIn.DefaultRoleId);
    //     if(role.Role.IsLOBWiseAccess){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }

}


