import axios from "axios";
import Constants from "expo-constants";

const env = Constants.expoConfig?.extra || {};
const KAKAO_REST_API_KEY = env.kakaoRestApiKey as string;

export interface KakaoAddress {
	addressName: string;
	zoneNo: string;
}

interface KakaoAddressDocument {
	address_name: string;
	road_address?: {
		address_name: string;
		zone_no: string;
	};
	address?: {
		address_name: string;
	};
}

interface KakaoAddressResponse {
	documents: KakaoAddressDocument[];
}

export const searchAddress = async (query: string): Promise<KakaoAddress[]> => {
	const res = await axios.get<KakaoAddressResponse>(
		"https://dapi.kakao.com/v2/local/search/address.json",
		{
			params: { query },
			headers: {
				Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
			},
		}
	);

	return res.data.documents
		.filter((doc) => doc.road_address)
		.map((doc) => ({
			addressName: doc.road_address!.address_name,
			zoneNo: doc.road_address!.zone_no,
		}));
};
