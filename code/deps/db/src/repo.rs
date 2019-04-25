use crate::prelude::*;
use diesel::query_builder::{Query, AsQuery, QueryFragment, QueryId, InsertStatement, AsChangeset, IntoUpdateTarget};
use diesel::backend::Backend;
use diesel::associations::HasTable;
use diesel::query_dsl::select_dsl::SelectDsl;
use diesel::sql_types::HasSqlType;
use diesel::helper_types::{Filter, Select};
use diesel::expression::helper_types::SqlTypeOf;
use diesel::dsl::{Eq, Update};
use diesel::query_dsl::filter_dsl::{FilterDsl, FindDsl};
use diesel::expression::AsExpression;
use diesel::insert_into;
use diesel::query_builder::UpdateStatement;

pub struct Repository<DB: Backend, C: Connection<Backend=DB>>(PhantomData<(DB, C)>);


type Id<T> = <T as Identifiable>::Id;
type TablePk<T> = <<T as HasTable>::Table as Table>::PrimaryKey;

pub trait GetAllDsl<T: HasTable> {
    type Output;
    fn get_all() -> Self::Output;
}

impl<T: HasTable> GetAllDsl<T> for T
    where T::Table: AsQuery + SelectDsl<<T::Table as Table>::AllColumns>,
{
    type Output = Select<T::Table, <T::Table as Table>::AllColumns>;

    fn get_all() -> Self::Output { SelectDsl::select(T::table(), T::Table::all_columns()) }
}


pub trait GetOneDsl<T: Identifiable>
{
    type Output;
    fn get_one(id: Id<T>) -> Self::Output;
}

impl<T> GetOneDsl<T> for T
    where T: Identifiable,
          T::Table: FilterDsl<Eq<TablePk<T>, Id<T>>>,
          Id<T>: AsExpression<SqlTypeOf<TablePk<T>>>,
          TablePk<T>: ExpressionMethods,
{
    type Output = Filter<T::Table, Eq<TablePk<T>, Id<T>>>;

    fn get_one(id: Id<T>) -> Self::Output {
        FilterDsl::filter(T::table(), T::table().primary_key().eq(id))
    }
}
