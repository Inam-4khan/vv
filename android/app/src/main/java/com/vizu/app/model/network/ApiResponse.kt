package com.vizu.app.model.network

/**
 * Sealed class representing network response outcomes in Vizu Android app.
 */
sealed class ApiResponse<out T> {
    data class Success<out T>(val data: T) : ApiResponse<T>()
    data class Error(val code: Int, val message: String) : ApiResponse<Nothing>()
    data class Exception(val throwable: Throwable) : ApiResponse<Nothing>()

    val isSuccess: Boolean get() = this is Success

    fun getOrNull(): T? = when (this) {
        is Success -> data
        else -> null
    }

    fun exceptionOrNull(): Throwable? = when (this) {
        is Exception -> throwable
        is Error -> java.lang.Exception("HTTP $code: $message")
        else -> null
    }
}

/**
 * Extension helper to safely execute network calls and catch errors.
 */
suspend fun <T> safeApiCall(apiCall: suspend () -> T): ApiResponse<T> {
    return try {
        ApiResponse.Success(apiCall())
    } catch (e: retrofit2.HttpException) {
        ApiResponse.Error(
            code = e.code(),
            message = e.response()?.errorBody()?.string() ?: e.message()
        )
    } catch (e: Exception) {
        ApiResponse.Exception(e)
    }
}
