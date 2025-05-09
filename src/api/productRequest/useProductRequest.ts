import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { getSession } from "next-auth/react";
import { CreateProductRequest } from "@/interfaces/ProductRequest";
import {
  GetPaginatedProductRequestRespnoseDTO,
  GetProductRequestResponseDTO,
  ProductRequestListResponse,
  ProductRequestResponse,
  UpdateProductRequestDTO,
  UpdateProductRequestStatusDTO,
} from "@/dtos/productRequest";

const createProductRequest = async (
  newProductRequest: CreateProductRequest,
) => {
  const session = await getSession();

  const formData = new FormData();
  formData.append("name", newProductRequest.name);
  formData.append("desc", newProductRequest.desc);
  formData.append("budget", newProductRequest.budget.toString());
  formData.append("quantity", newProductRequest.quantity.toString());
  formData.append("category", newProductRequest.category);
  formData.append("from", newProductRequest.from);
  formData.append("to", newProductRequest.to);
  formData.append("check_service", newProductRequest.check_service.toString());

  newProductRequest.images.forEach((image) => {
    formData.append(`images`, image);
  });

  const { data } = await axiosInstance.post("/product-requests", formData, {
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

const getProductRquestsByID = async (id: number) => {
  const session = await getSession();
  const { data } = await axiosInstance.get<ProductRequestResponse>(
    `/product-requests/get/${id}`,
    {
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    },
  );
  return data;
};

const getPaginatedProductRequests = async (page: number, limit: number) => {
  const session = await getSession();
  const { data } = await axiosInstance.get<
    GetPaginatedProductRequestRespnoseDTO<GetProductRequestResponseDTO>
  >(`/product-requests/get?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
  return data;
};

const getBuyerProductRequests = async () => {
  const session = await getSession();
  const { data } = await axiosInstance.get<ProductRequestListResponse>(
    `/product-requests/get-buyer`,
    {
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    },
  );
  return data;
};
const getTravelerProductRequests = async () => {
  const session = await getSession();
  const { data } = await axiosInstance.get<ProductRequestListResponse>(
    `/product-requests/get-traveler`,
    {
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    },
  );
  return data;
};

const updateProductRequest = async (
  productData: UpdateProductRequestDTO,
  id: number,
) => {
  const session = await getSession();
  const { data } = await axiosInstance.put(
    `/product-requests/${id}`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    },
  );
  return data;
};

const updateProductRequestStatus = async (
  req: UpdateProductRequestStatusDTO, 
  id: number,
) => {
  const session = await getSession();
  const { data } = await axiosInstance.put(
    `/product-requests/status/${id}`,
    req,
    {
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    },
  );
  return data;
};

const cancelProductRequest = async (
  req: UpdateProductRequestStatusDTO,
  id: number,
) => {
  const session = await getSession();
  const { data } = await axiosInstance.put(
    `/product-requests/status/${id}`,
    req,
    {
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    },
  );
  return data;
};

const useUpdateProductRequestStatus = (id: number) => {
  const queryClient = useQueryClient(); 
  return useMutation({
      mutationFn: async (req : UpdateProductRequestStatusDTO) =>
        updateProductRequestStatus(req, id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["productRquests", id] });
      },
  });
};


const useCancelProductRequest = (id: number) => {
  return useMutation({
    mutationFn: async (req: UpdateProductRequestStatusDTO) =>
      cancelProductRequest(req, id),
  });
};

const useUpdateProductRequest = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: UpdateProductRequestDTO) =>
      updateProductRequest(productData, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productRquests", id] });
    },
  });
};

const useGetBuyerProductRequests = () => {
  return useQuery({
    queryKey: ["productRquests"],
    queryFn: () => getBuyerProductRequests(),
    staleTime: 5 * 60 * 1000,
  });
};

const useGetTravelerProductRequests = () => {
  return useQuery({
    queryKey: ["productRquests"],
    queryFn: () => getTravelerProductRequests(),
    staleTime: 5 * 60 * 1000,
  });
};

const useGetPaginatedProductRequests = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["productRquests", page, limit],
    queryFn: () => getPaginatedProductRequests(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

const useGetProductRequestByID = (id: number) => {
  return useQuery({
    queryKey: ["productRquests", id],
    queryFn: () => getProductRquestsByID(id),
    staleTime: 5 * 60 * 1000,
  });
};

const useCreateProductRequest = () => {
  return useMutation({
    mutationFn: createProductRequest,
  });
};

export {
  useCreateProductRequest,
  useGetProductRequestByID,
  useGetPaginatedProductRequests,
  useGetBuyerProductRequests,
  useGetTravelerProductRequests,
  useUpdateProductRequest,
  useUpdateProductRequestStatus,
  useCancelProductRequest,
};
