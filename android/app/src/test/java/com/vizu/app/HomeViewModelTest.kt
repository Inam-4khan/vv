package com.vizu.app

import app.cash.turbine.test
import com.vizu.app.model.data.HomeFeedData
import com.vizu.app.model.network.VizuApiService
import com.vizu.app.repository.HomeRepository
import com.vizu.app.viewmodel.HomeViewModel
import com.vizu.app.viewmodel.UiState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.io.IOException

@OptIn(ExperimentalCoroutinesApi::class)
class HomeViewModelTest {

    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `loadHomeData transitions through Loading then Success state`() = runTest {
        val repository = HomeRepository()
        val viewModel = HomeViewModel(repository)

        viewModel.uiState.test {
            // Initial state is Loading
            assertEquals(UiState.Loading, awaitItem())

            // Advance scheduler to complete loadHomeData
            testScheduler.advanceUntilIdle()

            // Next state is Success
            val successItem = awaitItem()
            assertTrue("Expected UiState.Success but got $successItem", successItem is UiState.Success)
            
            val feedData = (successItem as UiState.Success).feedData
            assertEquals("Alex Rivers", feedData.userPersonaName)
            assertTrue(feedData.posts.isNotEmpty())

            cancelAndIgnoreRemainingEvents()
        }
    }

    @Test
    fun `loadHomeData sets Error state when repository throws exception`() = runTest {
        val failingApiService = object : VizuApiService {
            override suspend fun fetchHomeFeed(): HomeFeedData {
                throw IOException("Failed to connect to Vizu network server")
            }

            override suspend fun toggleZapPost(postId: String): Boolean {
                return false
            }
        }

        val repository = HomeRepository(apiService = failingApiService)
        val viewModel = HomeViewModel(repository)

        viewModel.uiState.test {
            // Initial state is Loading
            assertEquals(UiState.Loading, awaitItem())

            // Advance scheduler to complete coroutine
            testScheduler.advanceUntilIdle()

            // Next state is Error
            val errorItem = awaitItem()
            assertTrue("Expected UiState.Error but got $errorItem", errorItem is UiState.Error)
            
            val errorMessage = (errorItem as UiState.Error).message
            assertEquals("Failed to connect to Vizu network server", errorMessage)

            cancelAndIgnoreRemainingEvents()
        }
    }

    @Test
    fun `toggleZap updates zapped state on target post`() = runTest {
        val repository = HomeRepository()
        val viewModel = HomeViewModel(repository)
        testScheduler.advanceUntilIdle()

        val initialSuccess = viewModel.uiState.value as UiState.Success
        val targetPost = initialSuccess.feedData.posts.first()
        val targetId = targetPost.id

        viewModel.toggleZap(targetId)
        testScheduler.advanceUntilIdle()

        val updatedSuccess = viewModel.uiState.value as UiState.Success
        val updatedPost = updatedSuccess.feedData.posts.first { it.id == targetId }
        
        assertEquals(!targetPost.isZapped, updatedPost.isZapped)
    }
}

