package com.vizu.app.model.network

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Singleton object managing OkHttpClient, Retrofit initialization, and Auth interceptors.
 */
object ApiClient {

    private const val DEFAULT_BASE_URL = "https://api.vizu.app/"

    private var authToken: String? = null
    private var baseUrl: String = DEFAULT_BASE_URL

    /**
     * Sets current auth token for OkHttp Bearer interceptor
     */
    fun setAuthToken(token: String?) {
        authToken = token
    }

    fun getAuthToken(): String? = authToken

    fun clearAuthToken() {
        authToken = null
    }

    fun setBaseUrl(url: String) {
        baseUrl = url
    }

    /**
     * Custom Interceptor attaching Authorization header if token exists
     */
    private val authInterceptor = Interceptor { chain ->
        val originalRequest = chain.request()
        val requestBuilder = originalRequest.newBuilder()

        authToken?.let { token ->
            requestBuilder.header("Authorization", "Bearer $token")
        }
        requestBuilder.header("Accept", "application/json")

        val response = chain.proceed(requestBuilder.build())

        // Handle 401 Unauthorized globally
        if (response.code == 401) {
            clearAuthToken()
        }

        response
    }

    /**
     * Logging interceptor for debugging network calls
     */
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    /**
     * Configured OkHttpClient
     */
    val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)
            .build()
    }

    /**
     * Configured Retrofit client instance
     */
    val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    /**
     * Lazily created ApiService instance
     */
    val apiService: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }
}
