package com.example.hiazee.di

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import com.example.hiazee.data.local.datastore.UserPreference
import com.example.hiazee.data.remote.retrofit.RetrofitClient
import com.example.hiazee.data.remote.retrofit.RetrofitML
import com.example.hiazee.data.repository.*

object Injection {
    fun provideUserRepository(dataStore: DataStore<Preferences>): UserRepository {
        val apiService = RetrofitClient.apiService
        val pref = UserPreference.getInstance(dataStore)
        return UserRepository.getInstance(apiService, pref)
    }

    fun provideProductRepository(): ProductRepository {
        val apiService = RetrofitClient.apiService
        return ProductRepository.getInstance(apiService)
    }

    fun provideShipAddressRepository(): ShipAddressRepository {
        val apiService = RetrofitClient.apiService
        return ShipAddressRepository.getInstance(apiService)
    }

    fun provideOrderListRepository(): OrderListRepository {
        val apiService = RetrofitClient.apiService
        return OrderListRepository.getInstance(apiService)
    }

    fun provideCartRepository(): CartRepository {
        val apiService = RetrofitClient.apiService
        return CartRepository.getInstance(apiService)
    }

    fun provideMLRepository(): MLRepository {
        val apiService = RetrofitML.apiService
        return MLRepository.getInstance(apiService)
    }
}