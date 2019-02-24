/*
 * This file is part of Async ZMQ Derive.
 *
 * Copyright © 2018 Riley Trautman
 *
 * Async ZMQ Derive is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Async ZMQ Derive is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Async ZMQ Derive.  If not, see <http://www.gnu.org/licenses/>.
 */

#[macro_use]
extern crate quote;

extern crate proc_macro;

use self::proc_macro::TokenStream;
use syn::{Attribute, Data, DeriveInput, Fields, Ident, Type};

#[proc_macro_derive(SocketWrapper, attributes(sink, stream))]
pub fn socket_derive(input: TokenStream) -> TokenStream {
    let input: DeriveInput = syn::parse(input).unwrap();

    if !only_has_inner_socket(&input.data) {
        panic!("Expected to derive for struct with inner: Socket");
    }

    let name = input.ident;

    let from_sock = quote! {
        impl From<Socket> for #name {
            fn from(inner: Socket) -> Self {
                #name {
                    inner,
                }
            }
        }
    };

    let from_parts = quote! {
        impl From<RawSocket> for #name {
            fn from(inner: RawSocket) -> Self {
                #name {
                    inner: inner.into()
                }
            }
        }
    };

    let pair = if format!("{}", name).to_lowercase() == "pair" {
        quote! {
            impl async_zmq_types::Pair for #name {}
        }
    } else {
        quote! {
            impl async_zmq_types::UnPair for #name {}
        }
    };

    let sub = if format!("{}", name).to_lowercase() == "sub" {
        quote! {
            impl async_zmq_types::Sub for #name {}
        }
    } else {
        quote!{}
    };

    let kind = Ident::new(&format!("{}", name).to_uppercase(), name.span());

    let as_socket = quote! {
        impl crate::prelude::IntoInnerSocket for #name {
            type Socket = Socket;

            fn socket(self) -> Self::Socket {
                self.inner
            }

            fn kind() -> SocketType {
                #kind
            }
        }
    };

    let stream = if has_attr(&input.attrs, "stream") {
        quote!{
            impl crate::prelude::StreamSocket for #name {}
        }
    } else {
        quote!{}
    };

    let sink = if has_attr(&input.attrs, "sink") {
        quote!{
            impl crate::prelude::SinkSocket for #name {}
        }
    } else {
        quote!{}
    };

    let full = quote! {
        #from_sock
        #sub
        #pair
        #from_parts
        #as_socket
        #stream
        #sink
    };

    full.into()
}

fn has_attr(attrs: &[Attribute], name: &str) -> bool {
    attrs.iter().any(|attr| {
        attr.path
            .segments
            .last()
            .map(|seg| seg.into_value())
            .map(|seg| seg.ident == Ident::new(name, seg.ident.span()))
            .unwrap_or(false)
    })
}

fn only_has_inner_socket(input: &Data) -> bool {
    let data_struct = match *input {
        Data::Struct(ref data_struct) => data_struct,
        _ => return false, // TODO: Make this work for enums with sockets in each varient?
    };

    let fields_named = match data_struct.fields {
        Fields::Named(ref fields_named) => fields_named,
        _ => return false, // TODO: Allow other kinds of structs?
    };

    if fields_named.named.len() != 1 {
        return false;
    }

    let field = fields_named.named.first().unwrap().into_value();

    let found = field
        .ident
        .as_ref()
        .map(|id| *id == Ident::new("inner", id.span()))
        .unwrap_or(false);

    if !found {
        return false;
    }

    let type_path = match field.ty {
        Type::Path(ref type_path) => type_path,
        _ => return false,
    };

    type_path
        .path
        .segments
        .last()
        .map(|ps| ps.into_value())
        .map(|ps| ps.ident == Ident::new("Socket", ps.ident.span()))
        .unwrap_or(false)
}
