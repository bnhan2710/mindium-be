export const commonConfig = {
	PORT: process.env.PORT || 8000,
	corsOrigin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : '*',
	apiVersion: process.env.API_VERSION || '1',
};
