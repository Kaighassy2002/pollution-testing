import { commonAPI } from "./commonAPI"
import { SERVER_URL } from "./serverURL"


//datas 
export const vehicleDataAPI = async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/vehicleData`,reqBody)
}

//details
export const detailsAPI= async()=>{
    return  await commonAPI("GET",`${SERVER_URL}/allVehicleDetails`)
  }

  // Update user
export const updateAPI = async (id, reqBody) => {
    return await commonAPI("PUT", `${SERVER_URL}/update/${id}`, reqBody);
};

// Delete vehicle data
export const deleteAPI = async (id) => {
    return await commonAPI("DELETE", `${SERVER_URL}/delete/${id}`);
};
