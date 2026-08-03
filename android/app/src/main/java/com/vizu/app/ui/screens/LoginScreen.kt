package com.vizu.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Ghost
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vizu.app.ui.theme.*

@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit = {}
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    VizuTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    // Logo Icon
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .background(VizuTealPrimary.copy(alpha = 0.2f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Ghost,
                            contentDescription = "Vizu Logo",
                            tint = VizuTealPrimary,
                            modifier = Modifier.size(38.dp)
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "VIZU",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Black,
                            color = VizuTealLight,
                            letterSpacing = 4.sp
                        )
                        Text(
                            text = "Authenticate Spatial Persona",
                            fontSize = 12.sp,
                            color = VizuTextSecondary
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Input Form
                    OutlinedTextField(
                        value = username,
                        onValueChange = { username = it },
                        label = { Text("Persona Username") },
                        leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = VizuTealPrimary) },
                        singleLine = true,
                        shape = RoundedCornerShape(16.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = VizuCardBg,
                            unfocusedContainerColor = VizuCardBg,
                            focusedBorderColor = VizuTealPrimary,
                            unfocusedBorderColor = VizuCardBorder,
                            focusedTextColor = VizuTextPrimary,
                            unfocusedTextColor = VizuTextPrimary
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Secret Key") },
                        leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = VizuTealPrimary) },
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        shape = RoundedCornerShape(16.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = VizuCardBg,
                            unfocusedContainerColor = VizuCardBg,
                            focusedBorderColor = VizuTealPrimary,
                            unfocusedBorderColor = VizuCardBorder,
                            focusedTextColor = VizuTextPrimary,
                            unfocusedTextColor = VizuTextPrimary
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Button(
                        onClick = onLoginSuccess,
                        colors = ButtonDefaults.buttonColors(containerColor = VizuTealPrimary),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                    ) {
                        Text(
                            text = "CONNECT TO VIZU GRID",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF062B34),
                            letterSpacing = 1.sp
                        )
                    }
                }
            }
        }
    }
}
